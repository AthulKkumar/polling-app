import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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

@Schema({ timestamps: true })
export class Polling {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    type: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true },
        votes: [{ type: String }],
      },
    ],
  })
  options: PollOption[];

  @Prop({ required: true, enum: ['public', 'private'], default: 'public' })
  visibility: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  allowedUsers: Types.ObjectId[];

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({
    type: [
      {
        userId: { type: Types.ObjectId, ref: 'User', required: true },
        optionId: { type: String, required: true },
        votedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  votes: Vote[];

  @Prop({ default: true })
  isActive: boolean;
}

export const PollingSchema = SchemaFactory.createForClass(Polling);

PollingSchema.index({ createdBy: 1 });
PollingSchema.index({ visibility: 1, isActive: 1 });
PollingSchema.index({ expiresAt: 1 });
