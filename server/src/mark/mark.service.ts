import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mark } from './mark.schema';

@Injectable()
export class MarkService {
  constructor(@InjectModel(Mark.name) private markModel: Model<Mark>) {}

  async create(dto) {
    try {
      return this.markModel.create(dto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(dto) {
    try {
      return this.markModel.findByIdAndUpdate(dto._id, dto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async Delete(id: string) {
    try {
      return await this.markModel.findByIdAndDelete(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findAll() {
    try {
      return this.markModel.find().exec();
    } catch (error) {
      throw error;
    }
  }
}
