import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SubcategoriesType = HydratedDocument<Subcategories>;

@Schema()
export class Subcategories {
  @Prop()
  title: string[];

  @Prop()
  productIds: string[];

  @Prop()
  markIds: string[];

  @Prop()
  subChildCategorieIds: string[];
}

export const SubcategoriesSchema = SchemaFactory.createForClass(Subcategories);
