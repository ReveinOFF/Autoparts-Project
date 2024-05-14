import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';

import { CreateCatogoriesDto } from './categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('add-categories')
  async create(@Body() createBrandDto: CreateCatogoriesDto) {
    return await this.categoriesService.create(createBrandDto);
  }

  @Get('all-categories')
  async getAll() {
    return await this.categoriesService.getAll();
  }

  @Delete('delete-category/:id')
  async delete(@Param('id') id: string) {
    return await this.categoriesService.Delete(id);
  }
}

// [
//   id_brand,
//   [
//     id_categiries1,
//     [
//       id_subcategories1,
//       [
//         id_subsubcategories1,
//         [

//         ],
//         id_subsubcategories2,
//         [

//         ],
//       ]
//       id_subcategories2,
//       [

//       ]
//     ],
//     id_categiries2,
//     [
//      id_subcategories1,
//      [

//      ]
//      id_subcategories2,
//      [

//      ]
//     ],
//   ]
// ]
