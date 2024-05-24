import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';

@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Post('add-subcategories')
  async create(@Body() create) {
    return await this.subcategoriesService.create(create);
  }

  @Get('get-all')
  async getAll() {
    return await this.subcategoriesService.getAll();
  }

  @Get('get-one/:id')
  async getOne(@Param('id') id: string) {
    return await this.subcategoriesService.getOne(id);
  }
}
