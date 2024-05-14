import { Injectable, Delete } from '@nestjs/common';
import { AddProductDto, FiltersProductDto } from './product.dto';
import { Product } from './product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as csvParse from 'csv-parser';
import * as xlsx from 'xlsx';
import { json2csv } from 'json-2-csv';
import { Readable } from 'stream';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productsModel: Model<Product>,
  ) {}

  async create(dto: AddProductDto) {
    try {
      return this.productsModel.create(dto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async Delete(id: string) {
    try {
      return await this.productsModel.findByIdAndDelete(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findAll(filters: FiltersProductDto) {
    try {
      // Построение объекта фильтрации на основе входных параметров
      const filterQuery: any = {};

      if (filters.categorieIds && filters.categorieIds.length > 0) {
        filterQuery.categorieId = { $in: filters.categorieIds };
      }

      if (filters.brandIds && filters.brandIds.length > 0) {
        filterQuery.brandId = { $in: filters.brandIds };
      }

      if (filters.modelIds && filters.modelIds.length > 0) {
        filterQuery.modelId = { $in: filters.modelIds };
      }

      if (filters.minPrice) {
        filterQuery.price = { $gte: filters.minPrice };
      }

      if (filters.maxPrice) {
        filterQuery.price = { ...filterQuery.price, $lte: filters.maxPrice };
      }

      return this.productsModel.find(filterQuery).exec();
    } catch (error) {
      throw error;
    }
  }

  async searchProd(text: string) {
    try {
      return this.productsModel
        .find({
          $or: [
            { title: { $in: [new RegExp(text, 'i')] } },
            { description: { $in: [new RegExp(text, 'i')] } },
          ],
        })
        .limit(4)
        .exec();
    } catch (error) {
      throw error;
    }
  }

  async findAllProductsById(ids: string[]) {
    try {
      const idsObject = ids?.map((id) => new Types.ObjectId(id));

      const products = await this.productsModel
        .find({
          _id: { $in: idsObject },
        })
        .exec();

      return products;
    } catch (error) {
      // Обработка ошибок при поиске по _id
      throw error;
    }
  }

  async importProductsFromFile(file: Express.Multer.File): Promise<Product[]> {
    const fileType = this.getFileType(file.mimetype);
    if (fileType === 'csv') {
      return await this.importCSV(file);
    } else if (fileType === 'xlsx') {
      return await this.importXLSX(file);
    } else {
      throw new Error('Неподдерживаемый тип файла');
    }
  }

  async exportProductsToFormat(format: string): Promise<any> {
    const products = await this.productsModel.find().exec();

    if (format === 'csv') {
      var fields = [
        '_id',
        'title',
        'image',
        'price',
        'modelIds',
        'brandIds',
        'categorieIds',
      ];
      var csv = json2csv(products, {
        keys: fields,
      });
      return csv;
    } else if (format === 'xlsx') {
      const prod = products.map((item, i) => {
        return {
          _id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          image: item.image.join(', '),
          categorieIds: item.categorieIds.join(', '),
          brandIds: item.brandIds.join(', '),
          modelIds: item.modelIds.join(', '),
        };
      });
      return prod;
    } else {
      throw new Error('Неподдерживаемый формат файла');
    }
  }

  private getFileType(mimeType: string): string {
    if (mimeType === 'text/csv') {
      return 'csv';
    } else if (
      mimeType === 'application/vnd.ms-excel' ||
      mimeType ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return 'xlsx';
    } else {
      throw new Error('Неподдерживаемый тип файла');
    }
  }

  private async importCSV(file: Express.Multer.File): Promise<Product[]> {
    const results: Product[] = [];
    return new Promise((resolve, reject) => {
      const stream = Readable.from([file.buffer]);

      stream
        .pipe(csvParse())
        .on('data', async (data) => {
          Object.keys(data).forEach((key) => {
            if (typeof data[key] === 'string') {
              if (data[key].startsWith('["') && data[key].endsWith('"]')) {
                data[key] = JSON.parse(data[key]);
              } else if (data[key].startsWith('"') && data[key].endsWith('"')) {
                data[key] = data[key].slice(1, -1);
              }
            }
          });

          Object.keys(data).forEach((key) => {
            if (
              typeof data[key] === 'string' &&
              data[key].startsWith('"') &&
              data[key].endsWith('"')
            ) {
              data[key] = data[key].slice(1, -1);
            }
          });

          const product = new this.productsModel(data);
          results.push(await product.save());
        })
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }

  private async importXLSX(file: Express.Multer.File): Promise<Product[]> {
    try {
      const workbook = xlsx.read(file.buffer);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet);

      const firstRowKeys = Object.keys(data[0] || {});

      const results: Product[] = [];
      for await (const rowData of data) {
        const item = {};
        for (const key of firstRowKeys) {
          if (typeof rowData[key] === 'string' && rowData[key].includes(',')) {
            item[key] = rowData[key].split(',').map((entry) => entry.trim());
          } else {
            item[key] = rowData[key];
          }
        }
        const product = new this.productsModel(item);
        try {
          const savedProduct = await product.save();
          results.push(savedProduct);
        } catch (error) {
          console.error(
            `Error saving product ${JSON.stringify(item)}: ${error}`,
          );
        }
      }

      return results;
    } catch (error) {
      return [];
    }
  }
}
