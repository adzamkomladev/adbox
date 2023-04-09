export interface AuthResponse {
    tokenType: string;
    expiresIn: number;
    accessToken: string;
    refreshToken: string;
}