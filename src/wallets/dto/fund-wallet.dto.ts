import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class FundWalletDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly paymentMethodId: string;

  @IsNotEmpty()
  @IsNumber()
  readonly amount: number;
}
