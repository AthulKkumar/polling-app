import { Module } from '@nestjs/common';
import { PollingService } from './polling.service';
import { PollingController } from './polling.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Polling, PollingSchema } from './schemas/polling.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Polling.name, schema: PollingSchema }]),
  ],
  controllers: [PollingController],
  providers: [PollingService],
})
export class PollingModule {}
