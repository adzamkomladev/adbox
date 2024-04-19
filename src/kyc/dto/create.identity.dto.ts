import { Type } from "../enums/type.enum";

export class CreateIdentity {
    readonly type: Type;
    readonly front: string;
    readonly back: string;
    readonly combined: string;
}