import { registerAs } from '@nestjs/config';

export default registerAs('throttler', () => ({
    list: [
        {
            name: 'default',
            ttl: 60000,
            limit: 60
        }
    ]
}));