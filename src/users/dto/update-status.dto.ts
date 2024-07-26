import { IsEnum, IsNotEmpty } from 'class-validator';

import { Status } from '../../@common/enums/status.enum';

export class UpdateStatusDto {
    @IsNotEmpty()
    @IsEnum(Status)
    readonly status: Status;
}
