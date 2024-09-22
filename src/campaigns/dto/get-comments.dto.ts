import { IsNumber, IsOptional } from "class-validator";

import { Type } from "class-transformer";

export class GetCommentsQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    readonly size?: number;
}
