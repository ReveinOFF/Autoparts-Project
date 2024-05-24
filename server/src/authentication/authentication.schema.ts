import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ROLE, SEX } from 'src/enum/enum';

export type AuthenticationType = HydratedDocument<Authentication>;

export interface AddressItem {
  city: string;
  street: string;
  house: string;
  apartment: string;
}

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

  @Prop({
    type: [{ city: String, street: String, house: String, apartment: String }],
  })
  address: AddressItem[];

  @Prop()
  vin: string;

  @Prop()
  phone: string;

  @Prop()
  registrationDate: Date;

  @Prop()
  birthDay: Date;

  @Prop()
  orderIds: string[];

  @Prop()
  saveProductIds: string[];
}

export const AuthenticationSchema =
  SchemaFactory.createForClass(Authentication);
