import { IsBoolean, IsEmail, IsOptional } from "class-validator";

export class InteractWithCampaignDto {
    @IsOptional()
    @IsBoolean()
    readonly toggleLike?: boolean;

    @IsOptional()
    @IsBoolean()
    readonly view?: boolean;
}