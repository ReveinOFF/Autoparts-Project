import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { STATUS } from 'src/enum/enum';

export type OrderType = HydratedDocument<Order>;

export interface ProductItem {
  productId: string;
  quantity: number;
}

@Schema()
export class Order {
  @Prop()
  status: STATUS;

  @Prop()
  dataCreate: Date;

  @Prop({ type: [{ productId: String, quantity: Number }] })
  products: ProductItem[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
