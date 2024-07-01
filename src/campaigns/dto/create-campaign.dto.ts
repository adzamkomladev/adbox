import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinDate,
} from 'class-validator';
import { Type } from 'class-transformer';

import { IsAfterStart } from '../../@common/validators/is-after-start.validator';

export class CreateCampaignDto {
  @IsNotEmpty()
  @IsString()
  readonly name!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(16)
  targetAge!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  targetReach!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  budget!: number;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  link!: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @MinDate(new Date())
  start!: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @IsAfterStart()
  end!: Date;

  @IsOptional()
  @IsString()
  description?: string;
}
