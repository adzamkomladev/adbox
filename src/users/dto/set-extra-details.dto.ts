import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class SetExtraDetailsDto {
  @IsNotEmpty()
  @IsDate()
  readonly dateOfBirth: Date;

  @IsNotEmpty()
  @IsString()
  readonly country: string;
}
