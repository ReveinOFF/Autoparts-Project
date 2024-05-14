import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LangType = HydratedDocument<Lang>;

@Schema()
export class Lang {
  @Prop()
  ua: boolean = true;

  @Prop()
  en: boolean = true;
}

export const LangSchema = SchemaFactory.createForClass(Lang);
