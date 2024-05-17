import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Modele } from './modele.schema';

@Injectable()
export class ModeleService {
  constructor(@InjectModel(Modele.name) private modeleModel: Model<Modele>) {}

  async create(dto) {
    try {
      return this.modeleModel.create(dto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(dto) {
    try {
      return this.modeleModel.findByIdAndUpdate(dto._id, dto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async Delete(id: string) {
    try {
      return await this.modeleModel.findByIdAndDelete(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findAll() {
    try {
      return this.modeleModel.find().exec();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return this.modeleModel.findById(id).exec();
    } catch (error) {
      throw error;
    }
  }

  async findByMark(id: string[]) {
    try {
      return this.modeleModel
        .find({
          markIds: { $in: id },
        })
        .exec();
    } catch (error) {
      throw error;
    }
  }

  async findWithMark() {
    try {
      return this.modeleModel
        .aggregate([
          {
            $addFields: {
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
            $unwind: '$markIds',
          },
          {
            $lookup: {
              from: 'marks',
              localField: 'markIds',
              foreignField: '_id',
              as: 'mark',
            },
          },
          {
            $unwind: '$mark',
          },
          {
            $group: {
              _id: '$mark._id',
              markName: { $first: '$mark.title' },
              markImage: { $first: '$mark.image' },
              modele: { $push: '$$ROOT' },
            },
          },
          {
            $project: {
              _id: 0,
              markId: '$_id',
              markTitle: '$markName',
              markImage: '$markImage',
              modele: 1,
            },
          },
          {
            $unset: ['mark', 'markIds'],
          },
        ])
        .exec();
    } catch (error) {
      throw error;
    }
  }
}