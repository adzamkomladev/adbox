import { Sex } from "../../users/enums/sex.enum";

export class CreateProfile {
    readonly firstName: string;
    readonly lastName: string;
    readonly dateOfBirth: Date;
    readonly sex: Sex;
    readonly phone: string;
    readonly avatar?: string;
}