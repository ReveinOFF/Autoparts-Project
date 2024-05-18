import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { STATUS } from 'src/enum/enum';

export type OrderType = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop()
  status: STATUS;

  @Prop()
  dataCreate: Date;

  @Prop()
  productIds: string[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
