import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Decimal128, HydratedDocument } from 'mongoose';

export type CurrType = HydratedDocument<Curr>;

@Schema()
export class Curr {
  @Prop()
  key: string;

  @Prop()
  course: Number;
}

export const CurrSchema = SchemaFactory.createForClass(Curr);
