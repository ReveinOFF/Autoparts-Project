import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Modele } from './modele.schema';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class ModeleService {
  constructor(
    @InjectModel(Modele.name) private modeleModel: Model<Modele>,
    private readonly filesService: FilesService,
  ) {}

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
      const data = await this.modeleModel.findById(id);
      await this.filesService.deleteFile(data.image, 'upload');
      return await this.modeleModel.deleteOne({ _id: id });
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

  async findModelsByMark(id: string) {
    try {
      return this.modeleModel.find({ markIds: id }).exec();
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
      const marks = await this.modeleModel.db
        .collection('marks')
        .find()
        .toArray();

      const allModels = await this.modeleModel.find().exec();

      const modelsWithMarks = await this.modeleModel
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
            $unwind: {
              path: '$markIds',
              preserveNullAndEmptyArrays: true,
            },
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
            $unwind: {
              path: '$mark',
              preserveNullAndEmptyArrays: true,
            },
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

      const modelsWithAllMarks = marks.map((mark) => {
        const found = modelsWithMarks.find(
          (m) => String(m.markId) === String(mark._id),
        );
        if (found) {
          return found;
        } else {
          return {
            markId: mark._id,
            markTitle: mark.title,
            markImage: mark.image,
            modele: [],
          };
        }
      });

      const modelsInMarks = modelsWithAllMarks.flatMap((m) => m.modele);

      const modelsWithoutMarks = allModels.filter((model) => {
        return !modelsInMarks.some(
          (mod) => String(mod._id) === String(model._id),
        );
      });

      return {
        marks: modelsWithAllMarks,
        models: modelsWithoutMarks,
      };
    } catch (error) {
      throw error;
    }
  }
}
