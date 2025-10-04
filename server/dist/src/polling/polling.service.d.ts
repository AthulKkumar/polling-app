import { CreatePollingDto } from './dto/create-polling.dto';
import { UpdatePollingDto } from './dto/update-polling.dto';
import { VotePollingDto } from './dto/vote-polling.dto';
import { Model, Types } from 'mongoose';
import { Polling } from './schemas/polling.schema';
export interface UserPayload {
    sub: string;
    email: string;
    role: string;
}
export declare class PollingService {
    private pollingModel;
    constructor(pollingModel: Model<Polling>);
    create(createPollingDto: CreatePollingDto, user: UserPayload): Promise<import("mongoose").Document<unknown, {}, Polling, {}, {}> & Polling & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAll(user: UserPayload): Promise<(import("mongoose").Document<unknown, {}, Polling, {}, {}> & Polling & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findOne(id: string, user: UserPayload): Promise<import("mongoose").Document<unknown, {}, Polling, {}, {}> & Polling & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    update(id: string, updatePollingDto: UpdatePollingDto, user: UserPayload): Promise<Polling>;
    remove(id: string, user: UserPayload): Promise<void>;
    vote(id: string, voteDto: VotePollingDto, user: UserPayload): Promise<import("mongoose").Document<unknown, {}, Polling, {}, {}> & Polling & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getResults(id: string, user: UserPayload): Promise<{
        pollId: any;
        title: string;
        description: string;
        totalVotes: number;
        isActive: boolean;
        expiresAt: Date;
        results: {
            id: string;
            text: string;
            voteCount: number;
            percentage: string | number;
        }[];
    }>;
    getMyPolls(user: UserPayload): Promise<(import("mongoose").Document<unknown, {}, Polling, {}, {}> & Polling & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
}
