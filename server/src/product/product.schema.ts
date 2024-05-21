import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductType = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop()
  categorieIds: string[];

  @Prop()
  subCategorieIds: string[];

  @Prop()
  brandIds: string[];

  @Prop()
  modelIds: string[];

  @Prop()
  recallIds: string[];

  @Prop()
  price: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  characteristics: string;

  @Prop()
  image: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
