import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.schema';
import { Model } from 'mongoose';
import { STATUS } from 'src/enum/enum';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async create(dto) {
    try {
      return await this.orderModel.create(dto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findAllActive() {
    try {
      return await this.orderModel.find({ status: STATUS.ACTIVE }).exec();
    } catch (error) {
      throw error;
    }
  }

  async getOrderStatistic() {
    try {
      // Инициализация объекта для хранения статистики по статусам
      const result: Record<STATUS, { date: Date; count: number }[]> =
        {} as Record<STATUS, { date: Date; count: number }[]>;

      // Получаем все возможные статусы
      const statuses = Object.values(STATUS);

      // Инициализация массивов для каждого статуса
      statuses.forEach((status) => {
        result[status] = [];
      });

      for (let i = 0; i < 10; i++) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - i);

        const startOfDay = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          0,
          0,
          0,
        );
        const endOfDay = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 1,
          0,
          0,
          0,
        );

        const aggregationResult = await this.orderModel.aggregate([
          {
            $match: {
              dataCreate: {
                $gte: startOfDay,
                $lt: endOfDay,
              },
            },
          },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
        ]);

        aggregationResult.forEach((agg) => {
          result[agg._id].push({
            date: new Date(startOfDay), // Используем startOfDay для фиксированной даты
            count: agg.count,
          });
        });

        // Если для какого-то статуса нет заказов за этот день, добавим запись с count: 0
        statuses.forEach((status) => {
          if (
            !result[status].some(
              (r) => r.date.getTime() === startOfDay.getTime(),
            )
          ) {
            result[status].push({
              date: new Date(startOfDay),
              count: 0,
            });
          }
        });
      }

      // Обратный порядок для каждой записи по статусам
      statuses.forEach((status) => {
        result[status].reverse();
      });

      return result;
    } catch (error) {
      throw error;
    }
  }
}
