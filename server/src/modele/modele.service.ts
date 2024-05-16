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
}
