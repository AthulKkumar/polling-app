import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PollingService } from './polling.service';
import { CreatePollingDto } from './dto/create-polling.dto';
import { UpdatePollingDto } from './dto/update-polling.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/user.types';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('polling')
export class PollingController {
  constructor(private readonly pollingService: PollingService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create() {
    return 'Test Data';
    // return this.pollingService.create(createPollingDto);
  }

  @Get()
  findAll() {
    return this.pollingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePollingDto: UpdatePollingDto) {
    return this.pollingService.update(+id, updatePollingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pollingService.remove(+id);
  }
}
