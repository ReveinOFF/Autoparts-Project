import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Curr, CurrSchema } from './currency.schema';
import { CurrencyController } from './currency.controller';
import { CurrService } from './currency.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Curr.name, schema: CurrSchema }]),
  ],
  controllers: [CurrencyController],
  providers: [CurrService],
})
export class CurrModule {}
