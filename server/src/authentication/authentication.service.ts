import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Authentication } from './authentication.schema';
import {
  AuthDto,
  ChangePasswordDto,
  ChangeUserDto,
  LogouthDto,
} from './authentication.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  INCORECT_PWD,
  INVALID_TOKEN_MESSAGE,
  USER_ALREADY_CREATED,
} from 'src/utils/AppMessage';
import { ROLE } from 'src/enum/enum';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(Authentication.name) private authModel: Model<Authentication>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registration(dto) {
    const { login, password } = dto;

    const isUserCreated = await this.authModel.findOne({ login });

    if (isUserCreated) {
      throw new HttpException(USER_ALREADY_CREATED, HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(password, 3);

    const newUser = (
      await this.authModel.create({
        ...dto,
        role: ROLE.USER,
        password: hashPassword,
        token: '',
        registrationDate: new Date(),
      })
    ).toObject();

    const token = await this.jwtService.signAsync(
      { login, role: newUser.role, _id: newUser._id },
      {
        secret: this.configService.get('JWT_SECRET') || '6TzPv26KfZguepuKu4rM',
        expiresIn: '30d',
      },
    );

    const authUser = (
      await this.authModel
        .findOneAndUpdate(
          { _id: newUser._id },
          { token, lastEntered: new Date() },
        )
        .select('name surname role login token')
    ).toObject();

    return { ...authUser, token };
  }

  async login(dto: AuthDto): Promise<{ token: string }> {
    const { login, password } = dto;

    const user = await this.authModel.findOne({ login });

    if (!user) {
      throw new HttpException('INCORECT_LOGIN', HttpStatus.NOT_FOUND);
    }

    const isAuth = await bcrypt.compare(password, user.password);

    if (!isAuth) {
      throw new HttpException(INCORECT_PWD, HttpStatus.NOT_FOUND);
    }

    const token = await this.jwtService.signAsync(
      { login, role: user.role, _id: user._id },
      {
        secret: this.configService.get('JWT_SECRET') || '6TzPv26KfZguepuKu4rM',
        expiresIn: '30d',
      },
    );

    const authUser = (
      await this.authModel
        .findOneAndUpdate({ _id: user._id }, { token, lastEntered: new Date() })
        .select('name surname role login')
    ).toObject();

    return { ...authUser, token };
  }

  async adminLogin(dto: AuthDto): Promise<{ token: string }> {
    const { login, password } = dto;

    const user = await this.authModel.findOne({ login });

    if (!user || user.role !== ROLE.ADMIN) {
      throw new HttpException('INCORECT_LOGIN', HttpStatus.NOT_FOUND);
    }

    const isAuth = await bcrypt.compare(password, user.password);

    if (!isAuth) {
      throw new HttpException(INCORECT_PWD, HttpStatus.NOT_FOUND);
    }

    const token = await this.jwtService.signAsync(
      { login, role: user.role, _id: user._id },
      {
        secret: this.configService.get('JWT_SECRET') || '6TzPv26KfZguepuKu4rM',
        expiresIn: '30d',
      },
    );

    const authUser = (
      await this.authModel
        .findOneAndUpdate({ _id: user._id }, { token, lastEntered: new Date() })
        .select('name surname role login')
    ).toObject();

    return { ...authUser, token };
  }

  async refresh(token: string) {
    const user = await this.authModel
      .findOne({ token })
      .select('name surname role login');

    if (!user) {
      throw new HttpException(INVALID_TOKEN_MESSAGE, HttpStatus.FORBIDDEN);
    }
    return user;
  }

  async logout(dto: LogouthDto): Promise<void> {
    await this.authModel.findOneAndUpdate(dto, { token: '' });
    return;
  }

  async changePassword(dto: ChangePasswordDto) {
    try {
      const { userId, newPassword, oldPassword } = dto;

      const user = await this.authModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const passwordMatch = await bcrypt?.compare(oldPassword, user?.password);
      if (!passwordMatch) {
        throw new Error('Old password is incorrect');
      }

      const hashPassword = await bcrypt.hash(newPassword, 10);

      return await this.authModel.findByIdAndUpdate(userId, {
        password: hashPassword,
      });
    } catch (error) {
      throw new Error('Failed to change password: ' + error.message);
    }
  }

  async getUser(id: string): Promise<Authentication> {
    return await this.authModel.findById(id).exec();
  }

  async getProfile(id: string) {
    const user = await this.authModel.findOne({ _id: new Types.ObjectId(id) });

    const orderIds = user.orderIds.map((id) => new Types.ObjectId(id));

    const productIds = user.saveProductIds.map((id) => new Types.ObjectId(id));

    const orders = await this.authModel.db
      .collection('orders')
      .find({ _id: { $in: orderIds } })
      .toArray();

    const products = await this.authModel.db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray();

    for (const order of orders) {
      for (const item of order.productIds) {
        const product = await this.authModel.db
          .collection('products')
          .findOne({ _id: new Types.ObjectId(item.productId) });
        if (product) {
          item.name = product.title;
          item.price = product.price;
        }
      }
    }

    for (const product of products) {
      const recalls = await this.authModel.db
        .collection('recalls')
        .find({ productId: product._id.toString() })
        .toArray();
      product.reviews = recalls;
      product.reviewsCount = product.reviews.length;
      if (product.reviewsCount === 0) {
        product.rating = 5;
      } else {
        const validReviews = recalls.filter(
          (review) => review.star !== null && review.star !== undefined,
        );
        const sumStars = validReviews.reduce(
          (acc, review) => acc + review.star,
          0,
        );
        product.rating = sumStars / validReviews.length;
      }
    }

    return {
      _id: user._id,
      name: user.name,
      surname: user.surname,
      patronymic: user.patronymic,
      sex: user.sex,
      birthDay: user.birthDay,
      email: user.email,
      address: user.address,
      vin: user.vin,
      login: user.login,
      orders: orders,
      savedProducts: products,
    };
  }

  async changeUser(data) {
    const id = data.userId;
    delete data.userId;
    return await this.authModel.findByIdAndUpdate(id, data).exec();
  }

  async removeAcc(id) {
    return await this.authModel.findByIdAndDelete(id).exec();
  }

  async addFavourite(userId: string, saveProductId: string) {
    const res = await this.authModel
      .findById(new Types.ObjectId(userId))
      .exec();
    res.saveProductIds.push(saveProductId);
    return await this.authModel
      .findByIdAndUpdate(userId, { saveProductIds: res.saveProductIds })
      .exec();
  }

  async removeFavourite(userId: string, id: string) {
    const res = await this.authModel
      .findById(new Types.ObjectId(userId))
      .exec();
    const data = res.saveProductIds?.filter((f) => f !== id);
    return await this.authModel
      .findByIdAndUpdate(userId, { saveProductIds: data })
      .exec();
  }

  async getUserStatistic() {
    try {
      const result: { date: Date; count: number }[] = [];

      for (let i = 0; i < 10; i++) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - i);

        const count = await this.authModel.countDocuments({
          registrationDate: {
            $gte: new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate(),
              0,
              0,
              0,
            ),
            $lt: new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate() + 1,
              0,
              0,
              0,
            ),
          },
        });

        result.push({ date: currentDate, count });
      }

      return result.reverse();
    } catch (error) {
      throw error;
    }
  }
}
