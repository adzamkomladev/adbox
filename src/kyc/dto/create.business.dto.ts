import { Type } from "../enums/type.enum";

export class CreateBusiness {
    readonly type: Type;
    readonly url: string;
    readonly taxNumber?: string;
    readonly category?: string;
}