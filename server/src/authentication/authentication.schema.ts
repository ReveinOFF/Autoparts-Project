import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ROLE } from 'src/enum/enum';

export type AuthenticationType = HydratedDocument<Authentication>;

@Schema()
export class Authentication {
  @Prop()
  login: string;

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
  address: string;

  @Prop()
  phone: string;

  @Prop()
  registrationDate: Date;
}

export const AuthenticationSchema =
  SchemaFactory.createForClass(Authentication);
