import { Body, Controller, Get, Put } from '@nestjs/common';
import { InfoService } from './info.service';

@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Get()
  async getLang() {
    return await this.infoService.getInfo();
  }

  @Put()
  async updateLang(@Body() data) {
    return await this.infoService.updateInfo(data);
  }
}
