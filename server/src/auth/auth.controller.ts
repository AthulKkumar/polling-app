import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const { token, userId, role } =
      await this.authService.registerUser(registerUserDto);
    return { accessToken: token, userId, role };
  }

  @Post('login')
  async login(@Body() registerUserDto: any) {
    const { token, userId, role } = await this.authService.loginUser(
      registerUserDto.email,
      registerUserDto.password,
    );
    return { accessToken: token, userId, role };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
