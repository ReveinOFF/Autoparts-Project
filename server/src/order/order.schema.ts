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

  @Prop()
  surname: string;

  @Prop()
  name: string;

  @Prop()
  mobOrEml: string;

  @Prop()
  city: string;

  @Prop()
  post: string;

  @Prop()
  postData: string;

  @Prop()
  pay: string;

  @Prop()
  totalPrice: string;

  @Prop()
  comment: string;

  @Prop({ type: [{ productId: String, quantity: Number }] })
  products: ProductItem[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
