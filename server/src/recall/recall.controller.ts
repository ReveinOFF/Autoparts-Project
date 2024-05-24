import { Controller, Get, Param } from '@nestjs/common';
import { RecallService } from './recall.service';

@Controller('recall')
export class RecallController {
  constructor(private recallService: RecallService) {}

  @Get('user/:id')
  async getRecallByUserId(@Param('id') id: string) {
    return await this.recallService.getRecallByUserId(id);
  }
}
