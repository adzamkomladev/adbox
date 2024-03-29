import { Status } from '../../@common/enums/status.enum';

export class CreateUserDto {
  readonly email: string;
  readonly name: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly avatar?: string;
  readonly status?: Status;
  readonly roleId?: string;
  readonly roleTitle?: string;
  readonly firebaseId?: string;
}
