import { Body, Controller, Get, Put } from '@nestjs/common';
import { LangService } from './lang.service';
import { UpdateLang } from './lang.dto';

@Controller('lang')
export class LangController {
  constructor(private readonly langService: LangService) {}

  @Get()
  async getLang() {
    return await this.langService.getLang();
  }

  @Put()
  async updateLang(@Body() data: UpdateLang) {
    return await this.langService.updateLang(data);
  }
}
