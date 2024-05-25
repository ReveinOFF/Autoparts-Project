import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SubcategoriesType = HydratedDocument<Subcategories>;

@Schema()
export class Subcategories {
  @Prop()
  title: string[];

  @Prop()
  brandIds: string[];

  @Prop()
  categorieIds: string[];

  @Prop()
  subCategorieIds: string[];
}

export const SubcategoriesSchema = SchemaFactory.createForClass(Subcategories);
