import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
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

  async changeUser(data: ChangeUserDto) {
    return await this.authModel.findByIdAndUpdate(data.userId, data).exec();
  }
}
