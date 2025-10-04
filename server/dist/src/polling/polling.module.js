"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollingModule = void 0;
const common_1 = require("@nestjs/common");
const polling_service_1 = require("./polling.service");
const polling_controller_1 = require("./polling.controller");
const mongoose_1 = require("@nestjs/mongoose");
const polling_schema_1 = require("./schemas/polling.schema");
const jwt_1 = require("@nestjs/jwt");
let PollingModule = class PollingModule {
};
exports.PollingModule = PollingModule;
exports.PollingModule = PollingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: polling_schema_1.Polling.name, schema: polling_schema_1.PollingSchema }]),
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '1d' },
            }),
        ],
        controllers: [polling_controller_1.PollingController],
        providers: [polling_service_1.PollingService],
        exports: [polling_service_1.PollingService],
    })
], PollingModule);
//# sourceMappingURL=polling.module.js.map