import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

import { Sex } from "../../users/enums/sex.enum";
import { Type } from "class-transformer";

export class CreateProfile {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    readonly firstName: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    readonly lastName: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    readonly dateOfBirth: Date;

    @IsNotEmpty()
    @IsEnum(Sex)
    readonly sex: Sex;

    @IsOptional()
    @IsString()
    @IsUrl()
    readonly avatar?: string;
}