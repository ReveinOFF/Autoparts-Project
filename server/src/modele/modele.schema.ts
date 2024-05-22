import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ModeleType = HydratedDocument<Modele>;

@Schema()
export class Modele {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  markIds: string[];

  @Prop()
  subCategorieIds: string[];

  productsIds: string[];
}

export const ModeleSchema = SchemaFactory.createForClass(Modele);
