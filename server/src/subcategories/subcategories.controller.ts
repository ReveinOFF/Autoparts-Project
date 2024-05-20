import { Body, Controller, Post } from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';

@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Post('add-subcategories')
  async create(@Body() create) {
    return await this.subcategoriesService.create(create);
  }
}
