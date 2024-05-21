import { Module } from '@nestjs/common';
import { RecallService } from './recall.service';
import { RecallController } from './recall.controller';

@Module({
  providers: [RecallService],
  controllers: [RecallController]
})
export class RecallModule {}
