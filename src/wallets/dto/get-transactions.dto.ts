import { IsNumber, IsOptional } from "class-validator";

import { Type } from "class-transformer";
import { WalletTransaction } from "../../@common/db/entities";

export class GetAllTransactionsQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly size?: number;
}

export interface GetAllTransactionsDto {
    transactions: Partial<WalletTransaction>[];
    meta: Meta;
}

export interface Meta {
    page: number;
    size: number;
    total: number;
    totalPages: number;
}