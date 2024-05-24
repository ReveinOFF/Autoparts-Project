import { Module } from '@nestjs/common';
import { RecallService } from './recall.service';
import { RecallController } from './recall.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Recall, RecallSchema } from './recall.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recall.name, schema: RecallSchema }]),
  ],
  providers: [RecallService],
  controllers: [RecallController],
})
export class RecallModule {}
