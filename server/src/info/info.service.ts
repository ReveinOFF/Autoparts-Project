import { Injectable } from '@nestjs/common';
import { Info } from './info.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class InfoService {
  constructor(@InjectModel(Info.name) private infoModel: Model<Info>) {}

  async getInfo() {
    const info = await this.infoModel.findOne().exec();
    if (!info) {
      const defaultInfo = new this.infoModel({
        phoneOne: '+380661231231',
        phoneTwo: '+380631231231',
        email: 'autopartsinvolved@gmail.com',
      });
      return await defaultInfo.save();
    }
    return info;
  }

  async updateInfo(data) {
    await this.infoModel
      .findOneAndUpdate(null, {
        phoneOne: data.phoneOne,
        phoneTwo: data.phoneTwo,
        email: data.email,
      })
      .exec();
  }
}
