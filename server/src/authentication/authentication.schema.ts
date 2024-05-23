import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ROLE, SEX } from 'src/enum/enum';

export type AuthenticationType = HydratedDocument<Authentication>;

@Schema()
export class Authentication {
  @Prop()
  login: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  token: string;

  @Prop()
  name: string;

  @Prop()
  role: ROLE;

  @Prop()
  surname: string;

  @Prop()
  sex: SEX;

  @Prop()
  patronymic: string;

  @Prop()
  address: string[];

  @Prop()
  vin: string;

  @Prop()
  phone: string;

  @Prop()
  registrationDate: Date;

  @Prop()
  birthday: Date;

  @Prop()
  orderIds: string[];

  @Prop()
  saveProductIds: string[];
}

export const AuthenticationSchema =
  SchemaFactory.createForClass(Authentication);
