import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InfoType = HydratedDocument<Info>;

@Schema()
export class Info {
  @Prop()
  phoneOne: string;

  @Prop()
  phoneTwo: string;

  @Prop()
  email: string;
}

export const InfoSchema = SchemaFactory.createForClass(Info);
