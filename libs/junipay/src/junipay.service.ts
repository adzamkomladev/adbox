import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TokenService } from '@adbox/utils';

@Injectable()
export class JunipayService {
    private readonly logger = new Logger(JunipayService.name);

    constructor(private readonly config: ConfigService, private readonly token: TokenService) { }

    initiatePayment(channel: string = 'mobilem') { }
}
