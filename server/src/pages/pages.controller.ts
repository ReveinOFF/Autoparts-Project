import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PagesService } from './pages.service';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post('update-page')
  async update(@Body() data) {
    return await this.pagesService.updatePage(data);
  }

  @Get('get-page/:type')
  async get(@Param('type') type: string) {
    return await this.pagesService.getPage(type);
  }

  @Get('get-pages')
  async getAll() {
    return await this.pagesService.getPages();
  }
}
