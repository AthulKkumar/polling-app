import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
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
    return token;
  }

  async loginUser(email: string, password: string) {
    const user = await this.userService.getUserById({ email: email });
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

    return this.jwtService.signAsync(payload);
  }
}
