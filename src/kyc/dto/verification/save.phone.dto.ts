import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class SavePhone {
    @IsNotEmpty()
    @IsString()
    readonly phone: string;
}