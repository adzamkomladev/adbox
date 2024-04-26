import { KycLevel } from "../../@common/enums/kyc.level.enum";
import { Status } from "../../@common/enums/status.enum";

export interface JwtPayload {
  email: string;
  sub: string;
  isPhoneVerified?: boolean;
  role: Role;
  kyc?: Kyc;
}

export interface Role {
  id: string;
  name: string;
  code: string;
}

export interface Kyc {
  level: KycLevel;
  levels: Level[];
}

export interface Level {
  level: KycLevel;
  status: Status
}