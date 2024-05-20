import { Module } from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';
import { SubcategoriesController } from './subcategories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subcategories, SubcategoriesSchema } from './subcategories.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subcategories.name, schema: SubcategoriesSchema },
    ]),
  ],
  providers: [SubcategoriesService],
  controllers: [SubcategoriesController],
})
export class SubcategoriesModule {}
