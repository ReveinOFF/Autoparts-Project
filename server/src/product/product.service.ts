import { Injectable } from '@nestjs/common';
import { FiltersProductDto } from './product.dto';
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

  async create(dto) {
    try {
      return this.productsModel.create(dto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(dto) {
    try {
      return this.productsModel.findByIdAndUpdate(dto._id, dto);
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

  async findOne(id: string, userId: string) {
    const product = await this.productsModel.db
      .collection('products')
      .findOne({ _id: new Types.ObjectId(id) });

    const user = await this.productsModel.db
      .collection('authentications')
      .findOne({ _id: new Types.ObjectId(userId) });

    const recalls = await this.productsModel.db
      .collection('recalls')
      .find({ productId: product._id.toString() })
      .toArray();

    if (user?.saveProductIds?.includes(id)) product.isFav = true;
    else product.isFav = false;

    product.reviews = recalls;
    product.reviewsCount = product.reviews.length;
    if (product.reviewsCount === 0) {
      product.rating = 5;
    } else {
      const validReviews = recalls.filter(
        (review) => review.star !== null && review.star !== undefined,
      );
      const sumStars = validReviews.reduce(
        (acc, review) => acc + review.star,
        0,
      );
      product.rating = sumStars / validReviews.length;
    }

    return product;
  }

  async findOneWU(id: string) {
    const product = await this.productsModel.db
      .collection('products')
      .findOne({ _id: new Types.ObjectId(id) });

    const recalls = await this.productsModel.db
      .collection('recalls')
      .find({ productId: product._id.toString() })
      .toArray();

    const objectIds = recalls.map((item) => new Types.ObjectId(item.userId));

    const usersRec = await this.productsModel.db
      .collection('authentications')
      .find({ _id: { $in: objectIds } })
      .toArray();

    const usersMap = usersRec.reduce((map, user) => {
      map[user._id.toString()] = user;
      return map;
    }, {});

    const recallsWithUserData = recalls.map((recall) => {
      return {
        ...recall,
        user: usersMap[recall.userId],
      };
    });

    product.reviews = recallsWithUserData;
    product.reviewsCount = product.reviews.length;
    if (product.reviewsCount === 0) {
      product.rating = 5;
    } else {
      const validReviews = recalls.filter(
        (review) => review.star !== null && review.star !== undefined,
      );
      const sumStars = validReviews.reduce(
        (acc, review) => acc + review.star,
        0,
      );
      product.rating = sumStars / validReviews.length;
    }

    return product;
  }

  async findByIds(ids: string[]) {
    const objectIds = ids.map((id) => new Types.ObjectId(id));

    const products = await this.productsModel.db
      .collection('products')
      .find({ _id: { $in: objectIds } })
      .toArray();

    for (let product of products) {
      const recalls = await this.productsModel.db
        .collection('recalls')
        .find({ productId: product._id.toString() })
        .toArray();

      product.reviews = recalls;
      product.reviewsCount = product.reviews.length;
      if (product.reviewsCount === 0) {
        product.rating = 5;
      } else {
        const validReviews = recalls.filter(
          (review) => review.star !== null && review.star !== undefined,
        );
        const sumStars = validReviews.reduce(
          (acc, review) => acc + review.star,
          0,
        );
        product.rating = sumStars / validReviews.length;
      }
    }

    return products;
  }

  async findOneWithCat(id: string) {
    return await this.productsModel
      .aggregate([
        {
          $match: { _id: id },
        },
        {
          $lookup: {
            from: 'modele',
            localField: 'modelId',
            foreignField: '_id',
            as: 'modele',
          },
        },
      ])
      .exec();
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
            if (key === 'description' || key === 'characteristic') {
              return;
            }

            if (typeof data[key] === 'string') {
              if (data[key].startsWith('["') && data[key].endsWith('"]')) {
                data[key] = JSON.parse(data[key]);
              } else if (data[key].startsWith('"') && data[key].endsWith('"')) {
                data[key] = data[key].slice(1, -1);
              }
            }
          });

          Object.keys(data).forEach((key) => {
            if (key === 'description' || key === 'characteristic') {
              return;
            }

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
          if (key === 'description' || key === 'characteristic') {
            item[key] = rowData[key];
          } else if (
            typeof rowData[key] === 'string' &&
            rowData[key].includes(',')
          ) {
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
