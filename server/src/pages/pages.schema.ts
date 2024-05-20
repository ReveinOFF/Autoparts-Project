import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TYPEPAGE } from 'src/enum/enum';

export type PagesType = HydratedDocument<Pages>;

@Schema()
export class Pages {
  @Prop()
  type: TYPEPAGE;

  @Prop()
  content: string;
}

export const PagesSchema = SchemaFactory.createForClass(Pages);
