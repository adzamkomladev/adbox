export interface CreditRequest {
  name: string;
  amount: number;
  phone: string;
  description: string;
  reference: string;
}

export interface CreditResponse {
  code: number;
  zeepayId: number;
  amount: number;
  message: string;
}

export interface DebitRequest {
  name: string;
  amount: number;
  phone: string;
  description: string;
  reference: string;
}

export interface DebitResponse {
  code: number;
  zeepayId: number;
  amount: number;
  message: string;
}
