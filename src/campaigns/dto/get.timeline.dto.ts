import { IsNumber, IsOptional } from "class-validator";

export class GetTimelineDto {
    @IsOptional()
    @IsNumber()
    readonly page?: number;

    @IsOptional()
    @IsNumber()
    readonly size?: number;
}