import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Categories } from './categories.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Categories.name) private categoriesModel: Model<Categories>,
    private readonly filesService: FilesService,
  ) {}

  async create(createCategoriesDto) {
    try {
      const { title } = createCategoriesDto;

      const brand = await this.categoriesModel.findOne({ title });

      if (brand) {
        throw new HttpException('BRAND ALREADY EXISTS', HttpStatus.BAD_REQUEST);
      }

      const newBrand = await this.categoriesModel.create(createCategoriesDto);

      return newBrand;
    } catch (error) {
      throw error;
    }
  }

  async update(data) {
    try {
      return await this.categoriesModel.findByIdAndUpdate(data._id, data);
    } catch (error) {
      throw error;
    }
  }

  async Delete(id: string) {
    try {
      const documents = await this.categoriesModel.db
        .collection('marks')
        .find({ categoryIds: id })
        .toArray();

      for (const doc of documents) {
        await this.categoriesModel.db
          .collection('marks')
          .updateOne({ _id: doc._id }, { $pull: { categoryIds: id } });
      }

      const res = await this.categoriesModel.findById(id);
      await this.filesService.deleteFile(res.image, 'upload');

      return await this.categoriesModel.findByIdAndDelete(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAll() {
    try {
      return await this.categoriesModel.find();
    } catch (error) {
      throw error;
    }
  }

  async getOne(id: string) {
    try {
      return await this.categoriesModel.findById(id).exec();
    } catch (error) {
      throw error;
    }
  }
}
