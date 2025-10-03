import { IsString, IsNotEmpty } from 'class-validator';

export class VotePollingDto {
  @IsString()
  @IsNotEmpty()
  optionId: string;
}
