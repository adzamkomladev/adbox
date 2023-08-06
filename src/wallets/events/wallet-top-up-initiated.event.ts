export class WalletTopUpInitiatedEvent {
  userId: string;
  walletId: string;
  paymentMethodId: string;
  amount: number;
}
