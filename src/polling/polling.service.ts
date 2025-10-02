import { Injectable } from '@nestjs/common';
import { CreatePollingDto } from './dto/create-polling.dto';
import { UpdatePollingDto } from './dto/update-polling.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Polling } from './schemas/polling.schema';

@Injectable()
export class PollingService {
  constructor(
    @InjectModel(Polling.name) private pollingModel: Model<Polling>,
  ) {}

  create(createPollingDto: CreatePollingDto) {
    return 'This action adds a new polling';
  }

  findAll() {
    return `This action returns all polling`;
  }

  findOne(id: number) {
    return `This action returns a #${id} polling`;
  }

  update(id: number, updatePollingDto: UpdatePollingDto) {
    return `This action updates a #${id} polling`;
  }

  remove(id: number) {
    return `This action removes a #${id} polling`;
  }
}
