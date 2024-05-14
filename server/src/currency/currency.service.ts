import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Curr } from './currency.schema';

@Injectable()
export class CurrService {
  constructor(@InjectModel(Curr.name) private currModel: Model<Curr>) {}

  async getCurr(): Promise<Curr[]> {
    return await this.currModel.find().exec();
  }

  async addCurr(key: string): Promise<Curr> {
    try {
      return this.currModel.create({ key });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async removeCurr(id: string) {
    return await this.currModel.findByIdAndDelete(id).exec();
  }
}
