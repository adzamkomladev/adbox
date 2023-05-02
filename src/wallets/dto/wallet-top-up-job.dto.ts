export class WalletTopUpJobDto {
  readonly walletId: string;
  readonly paymentMethodId: string;
  readonly amount: number;
}
