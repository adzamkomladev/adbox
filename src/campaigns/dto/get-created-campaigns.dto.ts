import { IsNumber, IsOptional } from "class-validator";

import { Status } from "../../@common/enums/status.enum";
import { Type } from "class-transformer";

export class GetCreatedCampaignsQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly size?: number;
}


export class GetCreatedCampaignsDto {
    data: Campaign[];
    meta: Meta;
}

export interface Campaign {
    id: string;
    name: string;
    demographic: string;
    targetAge: number;
    impressions: ValueStat;
    crt: ValueStat;
    uniqueViews: ValueStat;
    status: Status;
}

export interface ValueStat {
    value: number;
    change: ValueChange;
}

export type ValueChange = 'up' | 'down' | 'none'

export interface Meta {
    page: number;
    size: number;
    total: number;
    totalPage: number;
}