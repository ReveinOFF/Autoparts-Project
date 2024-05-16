import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ModeleType = HydratedDocument<Modele>;

@Schema()
export class Modele {
  @Prop()
  brandId: string;

  @Prop()
  title: string;

  @Prop()
  description: string;
}

export const ModeleSchema = SchemaFactory.createForClass(Modele);
