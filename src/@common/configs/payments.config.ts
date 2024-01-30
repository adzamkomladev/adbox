import { registerAs } from '@nestjs/config';
import { PaymentProvider } from '../enums/payment.provider.enum';

export default registerAs('payments', () => ({
    providers: {
        default: process.env.PAYMENTS_PROVIDERS_DEFAULT as PaymentProvider
    }
}));