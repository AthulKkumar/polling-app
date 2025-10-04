import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../user/user.types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        registerUserDto.password,
        saltRounds,
      );
      const user = await this.userService.createUser({
        ...registerUserDto,
        password: hashedPassword,
      });
      const payload = {
        sub: user._id,
        username: user.username,
        email: user.email,
        role: user?.role,
      };
      const token = this.jwtService.signAsync(payload);
      return { token, userId: user._id, role: user.role };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async loginUser(email: string, password: string) {
    try {
      console.log(email, password);
      const user = await this.userService.getUserById(email);
      console.log(user);
      if (!user) {
        throw new Error('User not found');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      const payload = {
        sub: user._id,
        username: user.username,
        email: user.email,
        role: user?.role,
      };

      return {
        token: await this.jwtService.signAsync(payload),
        userId: user._id,
        role: user.role,
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }
}
