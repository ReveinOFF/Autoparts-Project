export class AuthDto {
  login: string;
  password: string;
}

export class LogouthDto {
  token: string;
}

export class UserIdDto {
  userId: string;
}

export class ChangePasswordDto extends UserIdDto {
  oldPassword: string;
  newPassword: string;
}

export class ChangeUserDto extends UserIdDto {
  login: string;
  name: string;
  surname: string;
  address: string;
  phone: string;
}

export class RegistrationDto extends AuthDto {
  name: string;
  surname: string;
}
