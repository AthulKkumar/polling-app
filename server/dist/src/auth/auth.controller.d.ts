import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUser.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerUserDto: RegisterUserDto): Promise<{
        accessToken: Promise<string> | undefined;
        userId: import("mongoose").Types.ObjectId | undefined;
        role: string | undefined;
    }>;
    login(registerUserDto: any): Promise<{
        accessToken: string | undefined;
        userId: import("mongoose").Types.ObjectId | undefined;
        role: string | undefined;
    }>;
    getProfile(req: any): any;
}
