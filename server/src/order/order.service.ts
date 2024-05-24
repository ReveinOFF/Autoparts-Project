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
      // Initialize the object to store statistics by status
      const result: Record<string, { date: Date; count: number }[]> = {};

      // Get all possible statuses
      const statuses = Object.values(STATUS);

      // Initialize arrays for each status
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
          // Safeguard to ensure the status is initialized in result
          if (!result[agg._id]) {
            console.warn(`Status ${agg._id} not initialized in result`);
            result[agg._id] = [];
          }
          result[agg._id].push({
            date: new Date(startOfDay),
            count: agg.count,
          });
        });

        // If there are no orders for a status on this day, add a record with count: 0
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

      // Reverse the order for each status's records
      statuses.forEach((status) => {
        result[status].reverse();
      });

      return result;
    } catch (error) {
      console.error('Error in getOrderStatistic:', error);
      throw error;
    }
  }
}
