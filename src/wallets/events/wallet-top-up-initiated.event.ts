export class WalletTopUpInitiatedEvent {
  readonly userId: string;
  readonly walletId: string;
  readonly paymentMethodId: string;
  readonly amount: number;
}
