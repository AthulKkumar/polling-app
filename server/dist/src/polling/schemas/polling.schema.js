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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollingSchema = exports.Polling = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Polling = class Polling {
    title;
    description;
    options;
    visibility;
    createdBy;
    allowedUsers;
    duration;
    expiresAt;
    votes;
    isActive;
};
exports.Polling = Polling;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Polling.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Polling.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: [
            {
                id: { type: String, required: true },
                text: { type: String, required: true },
                votes: [{ type: String }],
            },
        ],
    }),
    __metadata("design:type", Array)
], Polling.prototype, "options", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['public', 'private'], default: 'public' }),
    __metadata("design:type", String)
], Polling.prototype, "visibility", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Polling.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'User' }], default: [] }),
    __metadata("design:type", Array)
], Polling.prototype, "allowedUsers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Polling.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Polling.prototype, "expiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                userId: { type: mongoose_2.Types.ObjectId, ref: 'User', required: true },
                optionId: { type: String, required: true },
                votedAt: { type: Date, default: Date.now },
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], Polling.prototype, "votes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Polling.prototype, "isActive", void 0);
exports.Polling = Polling = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Polling);
exports.PollingSchema = mongoose_1.SchemaFactory.createForClass(Polling);
exports.PollingSchema.index({ createdBy: 1 });
exports.PollingSchema.index({ visibility: 1, isActive: 1 });
exports.PollingSchema.index({ expiresAt: 1 });
//# sourceMappingURL=polling.schema.js.map