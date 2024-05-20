import { Injectable } from '@nestjs/common';
import { Subcategories } from './subcategories.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectModel(Subcategories.name)
    private subcategoriesModel: Model<Subcategories>,
  ) {}

  async create(dto) {
    try {
      return this.subcategoriesModel.create(dto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
