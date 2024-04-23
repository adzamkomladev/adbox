import { IsEnum, IsNotEmpty, IsString, IsUrl } from "class-validator";

import { Type } from "../enums/type.enum";

export class CreateIdentity {
    @IsNotEmpty()
    @IsString()
    @IsEnum(Type)
    readonly type: Type;

    @IsString()
    @IsUrl()
    readonly front: string;

    @IsString()
    @IsUrl()
    readonly back: string;

    @IsString()
    @IsUrl()
    readonly combined: string;
}