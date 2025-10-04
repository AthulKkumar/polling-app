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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollingController = void 0;
const common_1 = require("@nestjs/common");
const polling_service_1 = require("./polling.service");
const create_polling_dto_1 = require("./dto/create-polling.dto");
const update_polling_dto_1 = require("./dto/update-polling.dto");
const vote_polling_dto_1 = require("./dto/vote-polling.dto");
const auth_guard_1 = require("../auth/auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_types_1 = require("../user/user.types");
const roles_guard_1 = require("../auth/roles.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let PollingController = class PollingController {
    pollingService;
    constructor(pollingService) {
        this.pollingService = pollingService;
    }
    async create(createPollingDto, user) {
        return await this.pollingService.create(createPollingDto, user);
    }
    async findAll(user) {
        return await this.pollingService.findAll(user);
    }
    async getMyPolls(user) {
        return await this.pollingService.getMyPolls(user);
    }
    async findOne(id, user) {
        return await this.pollingService.findOne(id, user);
    }
    async getResults(id, user) {
        return await this.pollingService.getResults(id, user);
    }
    async vote(id, voteDto, user) {
        return await this.pollingService.vote(id, voteDto, user);
    }
    async update(id, updatePollingDto, user) {
        return await this.pollingService.update(id, updatePollingDto, user);
    }
    async remove(id, user) {
        await this.pollingService.remove(id, user);
        return { message: 'Poll deleted successfully' };
    }
};
exports.PollingController = PollingController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_types_1.Role.ADMIN),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_polling_dto_1.CreatePollingDto, Object]),
    __metadata("design:returntype", Promise)
], PollingController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PollingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-polls'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_types_1.Role.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PollingController.prototype, "getMyPolls", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PollingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/results'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PollingController.prototype, "getResults", null);
__decorate([
    (0, common_1.Post)(':id/vote'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, vote_polling_dto_1.VotePollingDto, Object]),
    __metadata("design:returntype", Promise)
], PollingController.prototype, "vote", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_types_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_polling_dto_1.UpdatePollingDto, Object]),
    __metadata("design:returntype", Promise)
], PollingController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_types_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PollingController.prototype, "remove", null);
exports.PollingController = PollingController = __decorate([
    (0, common_1.Controller)('polling'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [polling_service_1.PollingService])
], PollingController);
//# sourceMappingURL=polling.controller.js.map