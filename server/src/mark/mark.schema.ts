import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MarkType = HydratedDocument<Mark>;

@Schema()
export class Mark {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  categoryIds: string[];
}

export const MarkSchema = SchemaFactory.createForClass(Mark);
