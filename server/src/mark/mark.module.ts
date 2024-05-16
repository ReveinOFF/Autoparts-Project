import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mark, MarkSchema } from './mark.schema';
import { MarkController } from './mark.controller';
import { MarkService } from './mark.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Mark.name, schema: MarkSchema }]),
  ],
  controllers: [MarkController],
  providers: [MarkService],
})
export class MarkModule {}
