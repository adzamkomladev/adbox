import { IsNumber, IsOptional } from "class-validator";

import { Status } from "../../@common/enums/status.enum";
import { Type } from "class-transformer";

export class GetTimelineQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly size?: number;
}


export class GetTimelineDto {
    data: Campaign[];
    meta: Meta;
}

export interface Campaign {
    id: string;
    name: string;
    description: string;
    asset: string;
    start: Date;
    end: Date;
    status: Status;
    likes: number;
    views: number;
}

export interface Meta {
    page: number;
    size: number;
    total: number;
    totalPage: number;
}