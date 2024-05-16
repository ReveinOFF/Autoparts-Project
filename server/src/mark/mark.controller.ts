import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MarkService } from './mark.service';

@Controller('mark')
export class MarkController {
  constructor(private readonly markService: MarkService) {}

  @Post('add-mark')
  async create(@Body() createDto) {
    return await this.markService.create(createDto);
  }

  @Put('put-mark')
  async update(@Body() dto) {
    return await this.markService.update(dto);
  }

  @Delete('delete-mark/:id')
  async delete(@Param('id') id: string) {
    return await this.markService.Delete(id);
  }

  @Get('all-mark')
  async findAll() {
    return this.markService.findAll();
  }
}
