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

  async getById(id) {
    try {
      return this.subcategoriesModel.findById(id).exec();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getByTitle(name: string) {
    try {
      return await this.subcategoriesModel.findOne({ title: name }).exec();
    } catch (error) {
      throw error;
    }
  }

  async delById(id) {
    try {
      return this.subcategoriesModel.findByIdAndDelete(id).exec();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateById(data) {
    try {
      return this.subcategoriesModel.findByIdAndUpdate(data._id, data).exec();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getOne(id, page = 1, limit = 40) {
    try {
      const skip = (page - 1) * limit;

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
          {
            $project: {
              totalProducts: { $size: '$products' },
              products: { $slice: ['$products', skip, limit] },
              marks: 1,
            },
          },
        ])
        .exec();

      const totalProducts = res[0].totalProducts;
      const totalPages = Math.ceil(totalProducts / limit);

      res[0].totalPages = totalPages;
      res[0].currPage = page;

      return res[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getOneFV(id, userId, page = 1, limit = 40) {
    try {
      const skip = (page - 1) * limit;

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
            $addFields: {
              products: { $slice: ['$products', skip, limit] },
              totalProducts: { $size: '$products' },
            },
          },
          {
            $project: {
              user: 0,
            },
          },
        ])
        .exec();

      if (res[0]?.totalProducts) {
        const totalProducts = res[0]?.totalProducts;
        const totalPages = Math.ceil(totalProducts / limit);

        res[0].totalPages = totalPages;
        res[0].currPage = page;
      }

      console.log(res);

      return res[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getOneMod(id, modId, page = 1, limit = 40) {
    try {
      const skip = (page - 1) * limit;

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
            $match: { 'products.modelIds': { $in: [modId] } },
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
          {
            $project: {
              totalProducts: { $size: '$products' },
              products: { $slice: ['$products', skip, limit] },
              marks: 1,
            },
          },
        ])
        .exec();

      const totalProducts = res[0].totalProducts;
      const totalPages = Math.ceil(totalProducts / limit);

      res[0].totalPages = totalPages;
      res[0].currPage = page;

      return res[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getOneFVMod(id, modId, userId, page = 1, limit = 40) {
    try {
      const skip = (page - 1) * limit;

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
            $match: { 'products.modelIds': { $in: [modId] } },
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
            $addFields: {
              products: { $slice: ['$products', skip, limit] },
              totalProducts: { $size: '$products' },
            },
          },
          {
            $project: {
              user: 0,
            },
          },
        ])
        .exec();

      if (res.length === 0) {
        return {
          totalPages: 0,
          currPage: page,
          products: [],
          totalProducts: 0,
        };
      }

      const totalProducts = res[0]?.totalProducts;
      const totalPages = Math.ceil(totalProducts / limit);

      if (res[0]) {
        res[0].totalPages = totalPages;
        res[0].currPage = page;
      }

      return res[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
