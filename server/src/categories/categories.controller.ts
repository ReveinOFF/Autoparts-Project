import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';

import { CreateCatogoriesDto, UpdateCatogoriesDto } from './categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('add-categories')
  async create(@Body() createBrandDto: CreateCatogoriesDto) {
    return await this.categoriesService.create(createBrandDto);
  }

  @Put('update-categories')
  async update(@Body() updateBrandDto: UpdateCatogoriesDto) {
    return await this.categoriesService.update(updateBrandDto);
  }

  @Get('all-categories')
  async getAll() {
    return await this.categoriesService.getAll();
  }

  @Get('one-category/:id')
  async getOne(@Param('id') id: string) {
    return await this.categoriesService.getOne(id);
  }

  @Delete('delete-category/:id')
  async delete(@Param('id') id: string) {
    return await this.categoriesService.Delete(id);
  }
}
