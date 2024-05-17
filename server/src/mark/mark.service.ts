import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mark } from './mark.schema';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class MarkService {
  constructor(
    @InjectModel(Mark.name) private markModel: Model<Mark>,
    private readonly filesService: FilesService,
  ) {}

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
      const data = await this.markModel.findById(id);
      await this.filesService.deleteFile(data.image, 'upload');

      const documents = await this.markModel.db
        .collection('modeles')
        .find({ markIds: id })
        .toArray();

      for (const doc of documents) {
        await this.markModel.db
          .collection('modeles')
          .updateOne({ _id: doc._id }, { $pull: { markIds: id } });
      }

      return await this.markModel.deleteOne({ _id: id });
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

  async findOne(id: string) {
    try {
      return this.markModel.findById(id).exec();
    } catch (error) {
      throw error;
    }
  }

  async findByCat(id: string[]) {
    try {
      return this.markModel
        .find({
          categoryIds: { $in: id },
        })
        .exec();
    } catch (error) {
      throw error;
    }
  }
}
