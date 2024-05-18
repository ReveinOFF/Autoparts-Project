import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('add-order')
  async create(@Body() create) {
    return await this.orderService.create(create);
  }

  @Get('get-active')
  async findAllActive() {
    return await this.orderService.findAllActive();
  }

  @Get('statistic')
  async Statistic() {
    return await this.orderService.getOrderStatistic();
  }
}
