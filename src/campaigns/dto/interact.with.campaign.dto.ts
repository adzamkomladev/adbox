import { IsBoolean, IsEmail, IsOptional } from "class-validator";

export class InteractWithCampaignDto {
    @IsOptional()
    @IsBoolean()
    readonly like?: boolean;

    @IsOptional()
    @IsBoolean()
    readonly view?: boolean;
}