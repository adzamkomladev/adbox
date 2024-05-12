import { IsBoolean, IsEmail, IsOptional } from "class-validator";

export class InteractWithPostDto {
    @IsOptional()
    @IsBoolean()
    readonly like?: boolean;

    @IsOptional()
    @IsBoolean()
    readonly view?: boolean;
}