import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RecallType = HydratedDocument<Recall>;

@Schema()
export class Recall {
  @Prop()
  message: string;

  @Prop()
  star: number;

  @Prop()
  dataCreate: Date;

  @Prop()
  productId: string;

  @Prop()
  userId: string;
}

export const RecallSchema = SchemaFactory.createForClass(Recall);
