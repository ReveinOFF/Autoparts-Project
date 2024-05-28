import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
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
  async getOne(@Param('id') id: string, @Query('page') page: string) {
    return await this.subcategoriesService.getOne(id, parseInt(page));
  }

  @Get('get-one/:id/:userId')
  async getOneFV(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Query('page') page: string,
  ) {
    return await this.subcategoriesService.getOneFV(id, userId, parseInt(page));
  }

  @Get('get-one-mod/:id/:modId')
  async getOneMod(
    @Param('id') id: string,
    @Param('modId') modId: string,
    @Query('page') page: string,
  ) {
    return await this.subcategoriesService.getOneMod(id, modId, parseInt(page));
  }

  @Get('get-one/:id/:modId/:userId')
  async getOneFVMod(
    @Param('id') id: string,
    @Param('modId') modId: string,
    @Param('userId') userId: string,
    @Query('page') page: string,
  ) {
    return await this.subcategoriesService.getOneFVMod(
      id,
      modId,
      userId,
      parseInt(page),
    );
  }
}
