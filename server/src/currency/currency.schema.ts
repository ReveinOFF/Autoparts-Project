import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CurrType = HydratedDocument<Curr>;

@Schema()
export class Curr {
  @Prop()
  key: string;
}

export const CurrSchema = SchemaFactory.createForClass(Curr);
