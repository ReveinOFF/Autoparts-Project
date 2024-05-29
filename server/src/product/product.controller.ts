import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FiltersProductDto } from './product.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('add-product')
  async create(@Body() createProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Put('put-product')
  async update(@Body() dto) {
    return await this.productService.update(dto);
  }

  @Delete('delete-product/:id')
  async delete(@Param('id') id: string) {
    return await this.productService.Delete(id);
  }

  @Post('all-product')
  async findAll(@Body() filters: FiltersProductDto) {
    return this.productService.findAll(filters);
  }

  @Get('get-product/:id/:userId')
  async findOne(@Param('id') id: string, @Param('userId') userId: string) {
    return this.productService.findOne(id, userId);
  }

  @Get('get-product/:id')
  async findOneWU(@Param('id') id: string) {
    return this.productService.findOneWU(id);
  }

  @Post('get-product-ids')
  async findByIds(@Body() ids: string[]) {
    return this.productService.findByIds(ids);
  }

  @Post('search-product')
  async searchProd(@Body('text') text: string) {
    return this.productService.searchProd(text);
  }

  @Post('all-product-by-id')
  async findAllProductsById(@Body() ids: string[]) {
    return this.productService.findAllProductsById(ids);
  }

  @Get('export')
  async exportProduct(@Query('format') format: string) {
    return this.productService.exportProductsToFormat(format);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importProduct(@UploadedFile() file: Express.Multer.File) {
    return this.productService.importProductsFromFile(file);
  }
}
