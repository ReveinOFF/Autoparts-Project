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

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('add-categories')
  async create(@Body() createBrandDto) {
    return await this.categoriesService.create(createBrandDto);
  }

  @Put('update-categories')
  async update(@Body() updateBrandDto) {
    return await this.categoriesService.update(updateBrandDto);
  }

  @Get('all-categories')
  async getAll() {
    return await this.categoriesService.getAll();
  }

  @Get('header-cat')
  async getCategoriesWithSubcategories() {
    return await this.categoriesService.getCategoriesWithSubcategories();
  }

  @Get('one-category/:id')
  async getOne(@Param('id') id: string) {
    return await this.categoriesService.getOne(id);
  }

  @Get('get-title/:title')
  async getByTitle(@Param('title') title: string) {
    return await this.categoriesService.getByTitle(title);
  }

  @Get('cat-mod/:id')
  async getCategoriesByModel(@Param('id') id: string) {
    return await this.categoriesService.getCategoriesByModel(id);
  }

  @Delete('delete-category/:id')
  async delete(@Param('id') id: string) {
    return await this.categoriesService.Delete(id);
  }

  @Get('get-sub-cat/:id')
  async getSubCategoriesByCat(@Param('id') id: string) {
    return await this.categoriesService.getSubCategoriesByCat(id);
  }
}
