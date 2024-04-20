export class VerifyOtpForUserDto {
    readonly userId: string;
    readonly phone: string;
    readonly code: string;
}