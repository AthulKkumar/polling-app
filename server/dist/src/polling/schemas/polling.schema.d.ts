import { HydratedDocument, Types } from 'mongoose';
export type PollingDocument = HydratedDocument<Polling>;
export interface PollOption {
    id: string;
    text: string;
    votes: string[];
}
export interface Vote {
    userId: Types.ObjectId;
    optionId: string;
    votedAt: Date;
}
export declare class Polling {
    title: string;
    description: string;
    options: PollOption[];
    visibility: string;
    createdBy: Types.ObjectId;
    allowedUsers: Types.ObjectId[];
    duration: number;
    expiresAt: Date;
    votes: Vote[];
    isActive: boolean;
}
export declare const PollingSchema: import("mongoose").Schema<Polling, import("mongoose").Model<Polling, any, any, any, import("mongoose").Document<unknown, any, Polling, any, {}> & Polling & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Polling, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Polling>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Polling> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
