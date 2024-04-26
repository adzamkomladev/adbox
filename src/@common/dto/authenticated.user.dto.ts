import { Kyc, Role } from "../../auth/interfaces/jwt.payload";

export class AuthenticatedUser {
    email: string;
    id: string;
    isPhoneVerified?: boolean;
    role: Role;
    kyc?: Kyc;
}