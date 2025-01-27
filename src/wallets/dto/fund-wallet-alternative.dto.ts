

import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { Network } from '@app/payments/enums/network.enum';
import { Channel } from '@app/payments/enums/channel.enum';

export class FundWalletAlternativeDto {
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

    @IsNotEmpty()
    @IsNumber()
    readonly amount: number;
}
