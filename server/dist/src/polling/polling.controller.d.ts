import { PollingService } from './polling.service';
import { CreatePollingDto } from './dto/create-polling.dto';
import { UpdatePollingDto } from './dto/update-polling.dto';
import { VotePollingDto } from './dto/vote-polling.dto';
import type { UserPayload } from './polling.service';
export declare class PollingController {
    private readonly pollingService;
    constructor(pollingService: PollingService);
    create(createPollingDto: CreatePollingDto, user: UserPayload): Promise<import("mongoose").Document<unknown, {}, import("./schemas/polling.schema").Polling, {}, {}> & import("./schemas/polling.schema").Polling & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAll(user: UserPayload): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/polling.schema").Polling, {}, {}> & import("./schemas/polling.schema").Polling & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getMyPolls(user: UserPayload): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/polling.schema").Polling, {}, {}> & import("./schemas/polling.schema").Polling & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findOne(id: string, user: UserPayload): Promise<import("mongoose").Document<unknown, {}, import("./schemas/polling.schema").Polling, {}, {}> & import("./schemas/polling.schema").Polling & {
        _id: import("mongoose").Types.ObjectId;
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
    vote(id: string, voteDto: VotePollingDto, user: UserPayload): Promise<import("mongoose").Document<unknown, {}, import("./schemas/polling.schema").Polling, {}, {}> & import("./schemas/polling.schema").Polling & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    update(id: string, updatePollingDto: UpdatePollingDto, user: UserPayload): Promise<import("./schemas/polling.schema").Polling>;
    remove(id: string, user: UserPayload): Promise<{
        message: string;
    }>;
}
