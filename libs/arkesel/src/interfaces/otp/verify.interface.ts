export interface VerifyRequest {
    phone: string;
    code: string;
}

export interface VerifyResponse {
    code: string;
    message: string;
}