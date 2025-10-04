import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { PollingService } from './polling.service';
import { CreatePollingDto } from './dto/create-polling.dto';
import { UpdatePollingDto } from './dto/update-polling.dto';
import { VotePollingDto } from './dto/vote-polling.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/user.types';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { UserPayload } from './polling.service';

@Controller('polling')
@UseGuards(AuthGuard)
export class PollingController {
  constructor(private readonly pollingService: PollingService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async create(
    @Body(ValidationPipe) createPollingDto: CreatePollingDto,
    @CurrentUser() user: UserPayload,
  ) {
    return await this.pollingService.create(createPollingDto, user);
  }

  @Get()
  async findAll(@CurrentUser() user: UserPayload) {
    return await this.pollingService.findAll(user);
  }

  @Get('my-polls')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async getMyPolls(@CurrentUser() user: UserPayload) {
    return await this.pollingService.getMyPolls(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return await this.pollingService.findOne(id, user);
  }

  @Get(':id/results')
  async getResults(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return await this.pollingService.getResults(id, user);
  }

  @Post(':id/vote')
  async vote(
    @Param('id') id: string,
    @Body(ValidationPipe) voteDto: VotePollingDto,
    @CurrentUser() user: UserPayload,
  ) {
    return await this.pollingService.vote(id, voteDto, user);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updatePollingDto: UpdatePollingDto,
    @CurrentUser() user: UserPayload,
  ) {
    return await this.pollingService.update(id, updatePollingDto, user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    await this.pollingService.remove(id, user);
    return { message: 'Poll deleted successfully' };
  }
}
