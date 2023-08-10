import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateCampaignDto {
  @IsNotEmpty()
  @IsString()
  readonly name!: string;

  @IsNotEmpty()
  @IsString()
  readonly demographic!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  targetAge!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  targetReach!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  budget!: number;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  link!: string;

  @IsNotEmpty()
  @IsDate()
  start!: Date;

  @IsNotEmpty()
  @IsDate()
  end!: Date;
}
