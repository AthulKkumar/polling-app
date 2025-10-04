import { UserService } from '../user/user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    registerUser(registerUserDto: RegisterUserDto): Promise<{
        token: Promise<string>;
        userId: import("mongoose").Types.ObjectId;
        role: string;
        error?: undefined;
    } | {
        error: any;
        token?: undefined;
        userId?: undefined;
        role?: undefined;
    }>;
    loginUser(email: string, password: string): Promise<{
        token: string;
        userId: import("mongoose").Types.ObjectId;
        role: string;
        error?: undefined;
    } | {
        error: any;
        token?: undefined;
        userId?: undefined;
        role?: undefined;
    }>;
}
