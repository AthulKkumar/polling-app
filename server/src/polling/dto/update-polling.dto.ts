import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreatePollingDto } from './create-polling.dto';
import { IsOptional, IsArray, IsString } from 'class-validator';

export class UpdatePollingDto extends PartialType(
  OmitType(CreatePollingDto, ['options', 'visibility', 'duration'] as const),
) {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedUserIds?: string[];
}
