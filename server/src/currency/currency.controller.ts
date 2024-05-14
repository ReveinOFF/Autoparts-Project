import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CurrService } from './currency.service';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currService: CurrService) {}

  @Get()
  async getCurr() {
    return await this.currService.getCurr();
  }

  @Post()
  async addCurr(@Body('key') key: string) {
    return await this.currService.addCurr(key);
  }

  @Delete('/:id')
  async removeCurr(@Param('id') id: string) {
    return await this.currService.removeCurr(id);
  }
}
