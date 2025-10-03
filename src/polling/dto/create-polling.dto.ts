import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsEnum,
  IsNumber,
  Min,
  Max,
  ArrayMinSize,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PollOptionDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class CreatePollingDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayMinSize(2, { message: 'Poll must have at least 2 options' })
  @ValidateNested({ each: true })
  @Type(() => PollOptionDto)
  options: PollOptionDto[];

  @IsEnum(['public', 'private'])
  visibility: 'public' | 'private';

  @IsNumber()
  @Min(1, { message: 'Duration must be at least 1 minute' })
  @Max(120, { message: 'Maximum duration is 2 hours' })
  duration: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedUserIds?: string[];
}
