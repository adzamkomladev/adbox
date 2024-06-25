import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

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
  @IsDateString()
  start!: Date;

  @IsNotEmpty()
  @IsDateString()
  end!: Date;

  @IsOptional()
  @IsString()
  description?: string;
}
