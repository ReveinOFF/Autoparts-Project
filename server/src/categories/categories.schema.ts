import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoriesType = HydratedDocument<Categories>;

@Schema()
export class Categories {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  subCategorieIds: string[];
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
