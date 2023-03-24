import { IsEnum, IsNotEmpty } from 'class-validator';

import { Role } from '../../@common/enums/role.enum';

export class SetRoleDto {
  @IsNotEmpty()
  @IsEnum(Role)
  readonly role: Role;
}
