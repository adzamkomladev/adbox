export interface GenerateRequest {
    phone: string;
    message?: string;
    sender?: string;
    type?: string;
    medium?: string;
    expiry?: number;
    length?: number;
}

export interface GenerateOtpResponse {
    code: string;
    ussd_code: string;
    message: string;
}

export interface GenerateResponse {
    code: string;
    ussdCode: string;
    message: string;
}

