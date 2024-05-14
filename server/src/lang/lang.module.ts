import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LangService } from './lang.service';
import { LangController } from './lang.controller';
import { Lang, LangSchema } from './lang.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lang.name, schema: LangSchema }]),
  ],
  controllers: [LangController],
  providers: [LangService],
})
export class LangModule {}
