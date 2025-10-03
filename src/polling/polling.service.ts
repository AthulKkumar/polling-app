import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreatePollingDto } from './dto/create-polling.dto';
import { UpdatePollingDto } from './dto/update-polling.dto';
import { VotePollingDto } from './dto/vote-polling.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Polling, PollOption } from './schemas/polling.schema';
import { v4 as uuidv4 } from 'uuid';

export interface UserPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class PollingService {
  constructor(
    @InjectModel(Polling.name) private pollingModel: Model<Polling>,
  ) {}

  async create(createPollingDto: CreatePollingDto, user: UserPayload) {
    if (
      createPollingDto.visibility === 'private' &&
      (!createPollingDto.allowedUserIds ||
        createPollingDto.allowedUserIds.length === 0)
    ) {
      throw new BadRequestException(
        'Private polls must have at least one allowed user',
      );
    }

    const options: PollOption[] = createPollingDto.options.map((option) => ({
      id: uuidv4(),
      text: option.text,
      votes: [],
    }));

    const expiresAt = new Date(
      Date.now() + createPollingDto.duration * 60 * 1000,
    );

    const newPoll = new this.pollingModel({
      ...createPollingDto,
      options,
      createdBy: new Types.ObjectId(user.sub),
      allowedUsers:
        createPollingDto.allowedUserIds?.map((id) => new Types.ObjectId(id)) ||
        [],
      expiresAt,
      votes: [],
      isActive: true,
    });

    return await newPoll.save();
  }

  async findAll(user: UserPayload) {
    const currentTime = new Date();

    await this.pollingModel.updateMany(
      { expiresAt: { $lt: currentTime }, isActive: true },
      { isActive: false },
    );

    let query: any;

    if (user.role === 'admin') {
      query = { createdBy: new Types.ObjectId(user.sub) };
    } else {
      query = {
        $or: [
          { visibility: 'public' },
          {
            visibility: 'private',
            allowedUsers: new Types.ObjectId(user.sub),
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

  async findOne(id: string, user: UserPayload) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid poll ID');
    }

    const poll = await this.pollingModel
      .findById(id)
      .populate('createdBy', 'username email')
      .populate('allowedUsers', 'username email')
      .exec();

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    if (user.role !== 'admin' || poll.createdBy._id.toString() !== user.sub) {
      if (poll.visibility === 'private') {
        const isAllowed = poll.allowedUsers.some(
          (allowedUser: any) => allowedUser._id.toString() === user.sub,
        );
        if (!isAllowed) {
          throw new ForbiddenException('Access denied to this private poll');
        }
      }
    }

    return poll;
  }

  async update(
    id: string,
    updatePollingDto: UpdatePollingDto,
    user: UserPayload,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid poll ID');
    }

    const poll = await this.pollingModel.findById(id);
    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    if (poll.createdBy.toString() !== user.sub) {
      throw new ForbiddenException('Only poll creator can update this poll');
    }

    if (!poll.isActive) {
      throw new BadRequestException('Cannot update expired polls');
    }

    const updateData: any = { ...updatePollingDto };
    if (updatePollingDto.allowedUserIds) {
      updateData.allowedUsers = updatePollingDto.allowedUserIds.map(
        (id) => new Types.ObjectId(id),
      );
      delete updateData.allowedUserIds;
    }

    return (await this.pollingModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('createdBy', 'username email')
      .populate('allowedUsers', 'username email')
      .exec()) as Polling;
  }

  async remove(id: string, user: UserPayload) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid poll ID');
    }

    const poll = await this.pollingModel.findById(id);
    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    if (poll.createdBy.toString() !== user.sub) {
      throw new ForbiddenException('Only poll creator can delete this poll');
    }

    await this.pollingModel.findByIdAndDelete(id);
  }

  async vote(id: string, voteDto: VotePollingDto, user: UserPayload) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid poll ID');
    }

    const poll = await this.pollingModel.findById(id);
    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    if (!poll.isActive || poll.expiresAt < new Date()) {
      throw new BadRequestException('Poll is no longer active');
    }

    if (poll.visibility === 'private') {
      const isAllowed = poll.allowedUsers.some(
        (allowedUserId) => allowedUserId.toString() === user.sub,
      );
      if (!isAllowed) {
        throw new ForbiddenException('Access denied to this private poll');
      }
    }

    const existingVote = poll.votes.find(
      (vote) => vote.userId.toString() === user.sub,
    );
    if (existingVote) {
      throw new BadRequestException('User has already voted on this poll');
    }

    const option = poll.options.find((opt) => opt.id === voteDto.optionId);
    if (!option) {
      throw new BadRequestException('Invalid option ID');
    }

    option.votes.push(user.sub);

    poll.votes.push({
      userId: new Types.ObjectId(user.sub),
      optionId: voteDto.optionId,
      votedAt: new Date(),
    });

    await poll.save();
    return poll;
  }

  async getResults(id: string, user: UserPayload) {
    const poll = await this.findOne(id, user);

    const userVoted = poll.votes.some(
      (vote) => vote.userId.toString() === user.sub,
    );

    if (!userVoted && poll.isActive) {
      throw new ForbiddenException(
        'Can only view results of polls you participated in or expired polls',
      );
    }

    const totalVotes = poll.votes.length;
    const results = poll.options.map((option) => ({
      id: option.id,
      text: option.text,
      voteCount: option.votes.length,
      percentage:
        totalVotes > 0
          ? ((option.votes.length / totalVotes) * 100).toFixed(2)
          : 0,
    }));

    return {
      pollId: (poll as any)._id.toString(),
      title: poll.title,
      description: poll.description,
      totalVotes,
      isActive: poll.isActive,
      expiresAt: poll.expiresAt,
      results,
    };
  }

  async getMyPolls(user: UserPayload) {
    return await this.pollingModel
      .find({ createdBy: new Types.ObjectId(user.sub) })
      .populate('createdBy', 'username email')
      .populate('allowedUsers', 'username email')
      .sort({ createdAt: -1 })
      .exec();
  }
}
