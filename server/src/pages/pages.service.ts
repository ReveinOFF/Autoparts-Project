import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pages } from './pages.schema';
import { Model } from 'mongoose';

@Injectable()
export class PagesService {
  constructor(@InjectModel(Pages.name) private pagesModel: Model<Pages>) {}

  async updatePage(data) {
    try {
      const find = await this.pagesModel.findOne({ type: data.type }).exec();

      if (!find) {
        return await this.pagesModel.create({
          type: data.type,
          content: data.content,
        });
      }

      return await this.pagesModel.updateOne({
        type: data.type,
        content: data.content,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getPage(type) {
    return await this.pagesModel.findOne({ type: type }).exec();
  }

  async getPages() {
    return await this.pagesModel.find().exec();
  }
}
