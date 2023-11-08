import { Status } from '../../@common/enums/status.enum';

export class CreateUserDto {
  readonly email: string;
  readonly name: string;
  readonly avatar: string;
  readonly status?: Status;
  readonly firebaseId?: string;
}
