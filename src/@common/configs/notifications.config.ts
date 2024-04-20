import { registerAs } from '@nestjs/config';

import { NotificationsProvider } from '../enums/notifications.provider.enum';

export default registerAs('notifications', () => ({
    otp: {
        default: NotificationsProvider.ARKESEL,
        backup: NotificationsProvider.ARKESEL
    },
    sms: {
        default: NotificationsProvider.ARKESEL,
        backup: NotificationsProvider.ARKESEL
    }
}));
