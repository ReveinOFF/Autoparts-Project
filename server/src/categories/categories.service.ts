import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Categories } from './categories.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async getCategoriesWithSubcategories() {
    const categories = await this.categoriesModel.aggregate([
      {
        $addFields: {
          subCategorieIds: {
            $map: {
              input: '$subCategorieIds',
              as: 'id',
              in: { $toObjectId: '$$id' },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'subCategorieIds',
          foreignField: '_id',
          as: 'subCategories',
        },
      },
      { $unwind: { path: '$subCategories', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          'subCategories.subChildCategorieIds': {
            $map: {
              input: '$subCategories.subChildCategorieIds',
              as: 'id',
              in: { $toObjectId: '$$id' },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'subCategories.subChildCategorieIds',
          foreignField: '_id',
          as: 'subCategories.subChildCategories',
        },
      },
      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' },
          description: { $first: '$description' },
          image: { $first: '$image' },
          modelIds: { $first: '$modelIds' },
          subCategorieIds: { $first: '$subCategorieIds' },
          subCategories: { $push: '$subCategories' },
        },
      },
      {
        $addFields: {
          subCategories: {
            $filter: {
              input: '$subCategories',
              as: 'subCategory',
              cond: { $ne: ['$$subCategory', {}] },
            },
          },
        },
      },
    ]);

    return categories;
  }

  async getAll() {
    try {
      return await this.categoriesModel.find();
    } catch (error) {
      throw error;
    }
  }

  async getCategoriesByModel(id) {
    try {
      const categoriesWithSubcategories = await this.categoriesModel.aggregate([
        { $match: { modelIds: { $in: [id] } } },
        {
          $addFields: {
            subCategorieIds: {
              $map: {
                input: '$subCategorieIds',
                as: 'subCategoryId',
                in: { $toObjectId: '$$subCategoryId' },
              },
            },
          },
        },
        {
          $lookup: {
            from: 'subcategories',
            localField: 'subCategorieIds',
            foreignField: '_id',
            as: 'subcategories',
          },
        },
        {
          $unwind: '$subcategories',
        },
        {
          $group: {
            _id: '$_id',
            title: { $first: '$title' },
            image: { $first: '$image' },
            subcategories: { $addToSet: '$subcategories' },
            productIds: { $addToSet: '$subcategories.productIds' },
          },
        },
        {
          $addFields: {
            count: { $size: '$productIds' },
          },
        },
      ]);

      return categoriesWithSubcategories;
    } catch (error) {
      console.error('Error in getCategoriesWithSubcategories:', error);
      throw error;
    }
  }

  async getSubCategoriesByCat(id) {
    try {
      const subCatByCat = await this.categoriesModel.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(id),
          },
        },
        {
          $addFields: {
            subCategorieIds: {
              $map: {
                input: '$subCategorieIds',
                as: 'id',
                in: { $toObjectId: '$$id' },
              },
            },
          },
        },
        {
          $lookup: {
            from: 'subcategories',
            localField: 'subCategorieIds',
            foreignField: '_id',
            as: 'subCategories',
          },
        },
        {
          $unwind: { path: '$subCategories', preserveNullAndEmptyArrays: true },
        },
        {
          $addFields: {
            'subCategories.subChildCategorieIds': {
              $map: {
                input: '$subCategories.subChildCategorieIds',
                as: 'id',
                in: { $toObjectId: '$$id' },
              },
            },
          },
        },
        {
          $lookup: {
            from: 'subcategories',
            localField: 'subCategories.subChildCategorieIds',
            foreignField: '_id',
            as: 'subCategories.subChildCategories',
          },
        },
        {
          $addFields: {
            'subCategories.subChildCategories.count': {
              $size: '$subCategories.subChildCategories.productIds',
            },
          },
        },
        {
          $group: {
            _id: '$_id',
            title: { $first: '$title' },
            subCategorieIds: { $first: '$subCategorieIds' },
            subCategories: { $push: '$subCategories' },
          },
        },
        {
          $addFields: {
            subCategories: {
              $filter: {
                input: '$subCategories',
                as: 'subCategory',
                cond: { $ne: ['$$subCategory', {}] },
              },
            },
          },
        },
      ]);

      return subCatByCat[0];
    } catch (error) {
      console.error('Error in getSubCategoriesByCat:', error);
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
