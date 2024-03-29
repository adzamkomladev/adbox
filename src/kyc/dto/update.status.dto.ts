import { Status } from "@common/enums/status.enum";
import { AttemptType } from "../enums/attempt.type.enum";

export class UpdateStatus {
    readonly type: AttemptType;
    readonly status: Status;
    readonly reason?: string;
}