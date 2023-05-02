import { Activity } from '../../wallets/enums/activity.enum';

export class PaymentCompletedEvent {
  paymentId: string;
  amount: number;
  walletId?: string;
  activity: Activity;
}
