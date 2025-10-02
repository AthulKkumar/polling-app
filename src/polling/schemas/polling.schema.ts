import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PollingDocument = HydratedDocument<Polling>;

@Schema()
export class Polling {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;
}

export const PollingSchema = SchemaFactory.createForClass(Polling);
