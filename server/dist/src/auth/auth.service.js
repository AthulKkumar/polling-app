"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    userService;
    jwtService;
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async registerUser(registerUserDto) {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt_1.default.hash(registerUserDto.password, saltRounds);
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
        }
        catch (error) {
            return {
                error: error.message,
            };
        }
    }
    async loginUser(email, password) {
        try {
            console.log(email, password);
            const user = await this.userService.getUserById(email);
            console.log(user);
            if (!user) {
                throw new Error('User not found');
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
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
        }
        catch (error) {
            return {
                error: error.message,
            };
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map