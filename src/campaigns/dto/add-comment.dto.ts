import { IsNotEmpty, IsString } from "class-validator";

export class AddCommentDto {
    @IsNotEmpty()
    @IsString()
    readonly text: string;
}