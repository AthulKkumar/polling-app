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
exports.PollingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const polling_schema_1 = require("./schemas/polling.schema");
const uuid_1 = require("uuid");
let PollingService = class PollingService {
    pollingModel;
    constructor(pollingModel) {
        this.pollingModel = pollingModel;
    }
    async create(createPollingDto, user) {
        if (createPollingDto.visibility === 'private' &&
            (!createPollingDto.allowedUserIds ||
                createPollingDto.allowedUserIds.length === 0)) {
            throw new common_1.BadRequestException('Private polls must have at least one allowed user');
        }
        const options = createPollingDto.options.map((option) => ({
            id: (0, uuid_1.v4)(),
            text: option.text,
            votes: [],
        }));
        const expiresAt = new Date(Date.now() + createPollingDto.duration * 60 * 1000);
        const newPoll = new this.pollingModel({
            ...createPollingDto,
            options,
            createdBy: new mongoose_2.Types.ObjectId(user.sub),
            allowedUsers: createPollingDto.allowedUserIds?.map((id) => new mongoose_2.Types.ObjectId(id)) ||
                [],
            expiresAt,
            votes: [],
            isActive: true,
        });
        return await newPoll.save();
    }
    async findAll(user) {
        const currentTime = new Date();
        await this.pollingModel.updateMany({ expiresAt: { $lt: currentTime }, isActive: true }, { isActive: false });
        let query;
        if (user.role === 'admin') {
            query = { createdBy: new mongoose_2.Types.ObjectId(user.sub) };
        }
        else {
            query = {
                $or: [
                    { visibility: 'public' },
                    {
                        visibility: 'private',
                        allowedUsers: new mongoose_2.Types.ObjectId(user.sub),
                    },
                ],
            };
        }
        return await this.pollingModel
            .find(query)
            .populate('createdBy', 'username email')
            .populate('allowedUsers', 'username email')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id, user) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid poll ID');
        }
        const poll = await this.pollingModel
            .findById(id)
            .populate('createdBy', 'username email')
            .populate('allowedUsers', 'username email')
            .exec();
        if (!poll) {
            throw new common_1.NotFoundException('Poll not found');
        }
        if (user.role !== 'admin' || poll.createdBy._id.toString() !== user.sub) {
            if (poll.visibility === 'private') {
                const isAllowed = poll.allowedUsers.some((allowedUser) => allowedUser._id.toString() === user.sub);
                if (!isAllowed) {
                    throw new common_1.ForbiddenException('Access denied to this private poll');
                }
            }
        }
        return poll;
    }
    async update(id, updatePollingDto, user) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid poll ID');
        }
        const poll = await this.pollingModel.findById(id);
        if (!poll) {
            throw new common_1.NotFoundException('Poll not found');
        }
        if (poll.createdBy.toString() !== user.sub) {
            throw new common_1.ForbiddenException('Only poll creator can update this poll');
        }
        if (!poll.isActive) {
            throw new common_1.BadRequestException('Cannot update expired polls');
        }
        const updateData = { ...updatePollingDto };
        if (updatePollingDto.allowedUserIds) {
            updateData.allowedUsers = updatePollingDto.allowedUserIds.map((id) => new mongoose_2.Types.ObjectId(id));
            delete updateData.allowedUserIds;
        }
        return (await this.pollingModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .populate('createdBy', 'username email')
            .populate('allowedUsers', 'username email')
            .exec());
    }
    async remove(id, user) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid poll ID');
        }
        const poll = await this.pollingModel.findById(id);
        if (!poll) {
            throw new common_1.NotFoundException('Poll not found');
        }
        if (poll.createdBy.toString() !== user.sub) {
            throw new common_1.ForbiddenException('Only poll creator can delete this poll');
        }
        await this.pollingModel.findByIdAndDelete(id);
    }
    async vote(id, voteDto, user) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid poll ID');
        }
        const poll = await this.pollingModel.findById(id);
        if (!poll) {
            throw new common_1.NotFoundException('Poll not found');
        }
        if (!poll.isActive || poll.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Poll is no longer active');
        }
        if (poll.visibility === 'private') {
            const isAllowed = poll.allowedUsers.some((allowedUserId) => allowedUserId.toString() === user.sub);
            if (!isAllowed) {
                throw new common_1.ForbiddenException('Access denied to this private poll');
            }
        }
        const existingVote = poll.votes.find((vote) => vote.userId.toString() === user.sub);
        if (existingVote) {
            throw new common_1.BadRequestException('User has already voted on this poll');
        }
        const option = poll.options.find((opt) => opt.id === voteDto.optionId);
        if (!option) {
            throw new common_1.BadRequestException('Invalid option ID');
        }
        option.votes.push(user.sub);
        poll.votes.push({
            userId: new mongoose_2.Types.ObjectId(user.sub),
            optionId: voteDto.optionId,
            votedAt: new Date(),
        });
        await poll.save();
        return poll;
    }
    async getResults(id, user) {
        const poll = await this.findOne(id, user);
        const userVoted = poll.votes.some((vote) => vote.userId.toString() === user.sub);
        if (!userVoted && poll.isActive) {
            throw new common_1.ForbiddenException('Can only view results of polls you participated in or expired polls');
        }
        const totalVotes = poll.votes.length;
        const results = poll.options.map((option) => ({
            id: option.id,
            text: option.text,
            voteCount: option.votes.length,
            percentage: totalVotes > 0
                ? ((option.votes.length / totalVotes) * 100).toFixed(2)
                : 0,
        }));
        return {
            pollId: poll._id.toString(),
            title: poll.title,
            description: poll.description,
            totalVotes,
            isActive: poll.isActive,
            expiresAt: poll.expiresAt,
            results,
        };
    }
    async getMyPolls(user) {
        return await this.pollingModel
            .find({ createdBy: new mongoose_2.Types.ObjectId(user.sub) })
            .populate('createdBy', 'username email')
            .populate('allowedUsers', 'username email')
            .sort({ createdAt: -1 })
            .exec();
    }
};
exports.PollingService = PollingService;
exports.PollingService = PollingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(polling_schema_1.Polling.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PollingService);
//# sourceMappingURL=polling.service.js.map