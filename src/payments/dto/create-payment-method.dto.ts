import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { Channel } from '../enums/channel.enum';
import { Network } from '../enums/network.enum';

export class CreatePaymentMethodDto {
  @IsNotEmpty()
  @IsEnum(Channel)
  readonly channel: Channel;

  @IsNotEmpty()
  @IsEnum(Network)
  readonly network: Network;

  @IsNotEmpty()
  @IsString()
  readonly accountNumber: string;

  @IsNotEmpty()
  @IsString()
  readonly accountName: string;

  @IsNotEmpty()
  @IsString()
  readonly networkCode: string;
}
