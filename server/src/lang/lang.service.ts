import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lang } from './lang.schema';
import { UpdateLang } from './lang.dto';

@Injectable()
export class LangService {
  constructor(@InjectModel(Lang.name) private langModel: Model<Lang>) {}

  async getLang(): Promise<Lang> {
    const lang = await this.langModel.findOne().exec();
    if (!lang) {
      const defaultLang = new this.langModel({ ua: true, en: true });
      return await defaultLang.save();
    }
    return lang;
  }

  async updateLang(data: UpdateLang) {
    await this.langModel
      .findOneAndUpdate(null, { ua: data.ua, en: data.en })
      .exec();
  }
}
