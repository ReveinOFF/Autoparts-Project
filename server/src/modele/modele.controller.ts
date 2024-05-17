import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ModeleService } from './modele.service';

@Controller('modele')
export class ModeleController {
  constructor(private readonly modeleService: ModeleService) {}

  @Post('add-modele')
  async create(@Body() createDto) {
    return await this.modeleService.create(createDto);
  }

  @Put('put-modele')
  async update(@Body() dto) {
    return await this.modeleService.update(dto);
  }

  @Delete('delete-modele/:id')
  async delete(@Param('id') id: string) {
    return await this.modeleService.Delete(id);
  }

  @Get('all-modele')
  async findAll() {
    return this.modeleService.findAll();
  }

  @Get('one-modele/:id')
  async findOne(@Param('id') id: string) {
    return this.modeleService.findOne(id);
  }

  @Post('modele-mark')
  async findByMark(@Body() id: string[]) {
    return this.modeleService.findByMark(id);
  }

  @Get('a-modele-mark')
  async findWithMark() {
    return this.modeleService.findWithMark();
  }
}
