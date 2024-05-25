import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductType = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop()
  subCategorieIds: string[];

  @Prop()
  modelIds: string[];

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
