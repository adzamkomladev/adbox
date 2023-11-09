import { Status } from '../../@common/enums/status.enum';

export class AuthenticatedDto {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly avatar: string;
  readonly status: Status;
  readonly walletId: string;
  readonly accessToken: string;
}
