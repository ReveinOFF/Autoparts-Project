import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Get,
  Put,
  Param,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import {
  AuthDto,
  ChangePasswordDto,
  ChangeUserDto,
  LogouthDto,
  RegistrationDto,
} from './authentication.dto';
import { LOGOUT_SUCCESS, TOKEN_NOT_FOUND_MESSAGE } from 'src/utils/AppMessage';

@Controller('authentication')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Post('registration')
  async registration(@Body() createAuthDto: RegistrationDto) {
    const newUser = await this.authService.registration(createAuthDto);
    if (!newUser.token) {
      throw new HttpException(TOKEN_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
    }
    return newUser;
  }

  @Post('login')
  async login(@Body() createAuthDto: AuthDto) {
    const user = await this.authService.login(createAuthDto);
    if (!user.token) {
      throw new HttpException(TOKEN_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
    }
    console.log(user);

    return user;
  }

  @Post('admin-login')
  async adminLogin(@Body() createAuthDto: AuthDto) {
    const user = await this.authService.adminLogin(createAuthDto);
    if (!user.token) {
      throw new HttpException(TOKEN_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
    }
    console.log(user);

    return user;
  }

  @Post('refresh')
  async refresh(@Body() payload) {
    const { token } = payload;

    if (!token) {
      throw new HttpException(TOKEN_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
    }

    const user = await this.authService.refresh(token);

    return user;
  }

  @Post('logout')
  async logout(@Body() createLogouthDto: LogouthDto) {
    await this.authService.logout(createLogouthDto);
    return { message: LOGOUT_SUCCESS };
  }

  @Get('user/:id')
  async getUser(@Param('id') id: string) {
    return await this.authService.getUser(id);
  }

  @Put('user/edit')
  async UpdateUser(@Body() data: ChangeUserDto) {
    return await this.authService.changeUser(data);
  }

  @Put('pass/edit')
  async UpdatePass(@Body() data: ChangePasswordDto) {
    return await this.authService.changePassword(data);
  }
}
