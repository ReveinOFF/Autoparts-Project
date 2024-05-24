import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Recall } from './recall.schema';

@Injectable()
export class RecallService {
  constructor(@InjectModel(Recall.name) private recallModel: Model<Recall>) {}

  async getRecallByUserId(id) {
    return await this.recallModel
      .aggregate([
        { $match: { userId: id } },
        {
          $addFields: {
            productIdObject: { $toObjectId: '$productId' },
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'productIdObject',
            foreignField: '_id',
            as: 'product',
          },
        },
        {
          $project: {
            _id: 1,
            message: 1,
            star: 1,
            dataCreate: 1,
            productName: { $arrayElemAt: ['$product.title', 0] },
          },
        },
      ])
      .exec();
  }
}
