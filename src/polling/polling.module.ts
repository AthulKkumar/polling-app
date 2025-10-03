import { Module } from '@nestjs/common';
import { PollingService } from './polling.service';
import { PollingController } from './polling.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Polling, PollingSchema } from './schemas/polling.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Polling.name, schema: PollingSchema }]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [PollingController],
  providers: [PollingService],
  exports: [PollingService],
})
export class PollingModule {}
