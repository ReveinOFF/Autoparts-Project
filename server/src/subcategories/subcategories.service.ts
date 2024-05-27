import { Injectable } from '@nestjs/common';
import { Subcategories } from './subcategories.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

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

  async getAll() {
    try {
      return this.subcategoriesModel.find().exec();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getOne(id) {
    try {
      const res = await this.subcategoriesModel
        .aggregate([
          {
            $match: { _id: new Types.ObjectId(id) },
          },
          {
            $addFields: {
              productIds: {
                $map: {
                  input: '$productIds',
                  as: 'id',
                  in: { $toObjectId: '$$id' },
                },
              },
              markIds: {
                $map: {
                  input: '$markIds',
                  as: 'id',
                  in: { $toObjectId: '$$id' },
                },
              },
            },
          },
          {
            $unwind: '$productIds',
          },
          {
            $lookup: {
              from: 'products',
              localField: 'productIds',
              foreignField: '_id',
              as: 'products',
            },
          },
          {
            $unwind: '$products',
          },
          {
            $lookup: {
              from: 'recalls',
              localField: 'products._id',
              foreignField: 'productId',
              as: 'products.recalls',
            },
          },
          {
            $addFields: {
              'products.reviewsCount': { $size: '$products.recalls' },
              'products.rating': {
                $cond: {
                  if: { $eq: [{ $size: '$products.recalls' }, 0] },
                  then: 5,
                  else: {
                    $avg: {
                      $filter: {
                        input: '$products.recalls',
                        as: 'recall',
                        cond: {
                          $and: [
                            { $ne: ['$$recall.star', null] },
                            { $ne: ['$$recall.star', undefined] },
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          {
            $group: {
              _id: '$_id',
              products: { $push: '$products' },
              markIds: { $first: '$markIds' },
            },
          },
          {
            $lookup: {
              from: 'marks',
              localField: 'markIds',
              foreignField: '_id',
              as: 'marks',
            },
          },
        ])
        .exec();

      return res[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getOneFV(id, userId) {
    try {
      const res = await this.subcategoriesModel
        .aggregate([
          {
            $match: { _id: new Types.ObjectId(id) },
          },
          {
            $addFields: {
              productIds: {
                $map: {
                  input: '$productIds',
                  as: 'id',
                  in: { $toObjectId: '$$id' },
                },
              },
              markIds: {
                $map: {
                  input: '$markIds',
                  as: 'id',
                  in: { $toObjectId: '$$id' },
                },
              },
            },
          },
          {
            $unwind: '$productIds',
          },
          {
            $lookup: {
              from: 'products',
              localField: 'productIds',
              foreignField: '_id',
              as: 'products',
            },
          },
          {
            $unwind: '$products',
          },
          {
            $addFields: {
              productIdString: { $toString: '$products._id' },
            },
          },
          {
            $lookup: {
              from: 'recalls',
              localField: 'productIdString',
              foreignField: 'productId',
              as: 'products.recalls',
            },
          },
          {
            $addFields: {
              'products.reviewsCount': { $size: '$products.recalls' },
              'products.rating': {
                $cond: {
                  if: { $eq: [{ $size: '$products.recalls' }, 0] },
                  then: 5,
                  else: {
                    $avg: {
                      $map: {
                        input: {
                          $filter: {
                            input: '$products.recalls',
                            as: 'recall',
                            cond: {
                              $and: [
                                { $ne: ['$$recall.star', null] },
                                { $ne: ['$$recall.star', undefined] },
                              ],
                            },
                          },
                        },
                        as: 'recall',
                        in: '$$recall.star',
                      },
                    },
                  },
                },
              },
            },
          },
          {
            $group: {
              _id: '$_id',
              products: { $push: '$products' },
              markIds: { $first: '$markIds' },
            },
          },
          {
            $lookup: {
              from: 'marks',
              localField: 'markIds',
              foreignField: '_id',
              as: 'marks',
            },
          },
          {
            $lookup: {
              from: 'authentications',
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$_id', { $toObjectId: userId }] },
                  },
                },
              ],
              as: 'user',
            },
          },
          {
            $unwind: { path: '$user' },
          },
          {
            $addFields: {
              products: {
                $map: {
                  input: '$products',
                  as: 'product',
                  in: {
                    $mergeObjects: [
                      '$$product',
                      {
                        isFav: {
                          $in: [
                            { $toString: '$$product._id' },
                            '$user.saveProductIds',
                          ],
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
          {
            $project: {
              user: 0,
            },
          },
        ])
        .exec();

      return res[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
