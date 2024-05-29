import { KycLevel } from '../../@common/enums/kyc.level.enum';
import { Status } from '../../@common/enums/status.enum';

import { Wallet, Role, Identity, Business, Attempt } from '../../@common/db/entities';


export class AuthenticatedDto {
  readonly user: AuthenticatedUser;
  readonly accessToken: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  status: Status;
  wallet: Partial<Wallet> | null;
  phone: string;
  isPhoneVerified: boolean;
  kyc: AuthenticatedUserKyc | null;
  role: Partial<Role>;
}

export interface AuthenticatedUserKyc {
  id: string;
  level: KycLevel;
  identity: Identity | null;
  business: Business | null;
  attempts: {
    latest: Attempt | null;
    total: number;
  },
  levels: KycLevelDetails;
}

export interface KycLevelDetails {
  level1: { status: Status };
  level2: { status: Status };
  level4: { status: Status };
}

// export interface KycLevelDetails {
//   level: KycLevel;
//   status: Status;
// }