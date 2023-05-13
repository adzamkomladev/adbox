export class WalletTopUpJobDto {
  readonly walletId: string;
  readonly userId: string;
  readonly paymentMethodId: string;
  readonly amount: number;
}
