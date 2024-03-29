import { Status } from '../../@common/enums/status.enum';

export class AuthenticatedDto {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly avatar: string;
  readonly status: Status;
  readonly walletId?: string;
  readonly accessToken: string;
}
