import { Injectable, Logger } from '@nestjs/common';

import { readFileSync } from 'fs';
import * as jwt from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';
import * as uniqid from 'uniqid';

import { Type } from '../enums/token/type.enum';


@Injectable()
export class TokenService {
    private readonly logger = new Logger(TokenService.name);

    generatePaymentRef(prefix: string) {
        const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 16)
        return prefix + nanoid();
    }

    generateTransactionRef(prefix: string) {
        return uniqid(prefix);
    }

    generateJwtToken(data: any, type: Type = Type.DEFAULT) {
        switch (type) {
            case Type.JUNIPAY:
                return this.generateJunipayJwtToken(data);
            default:
                return null;
        }
    }

    private generateJunipayJwtToken(data: any) {
        try {
            var privateKey = readFileSync('keys/junipay/private.key');

            return jwt.sign({ payload: data }, privateKey, { algorithm: 'RS256' });
        } catch (e) {
            this.logger.error('ERROR OCCURRED DURING GENERATION OF JUNIPAY JWT TOKEN: ', e)
            return null;
        }
    }

    private generateDefaultJwtToken(data: any) {
        try {
            var privateKey = readFileSync('keys/junipay/private.key');

            return jwt.sign({ payload: data }, privateKey, { algorithm: 'RS256' });
        } catch (e) {
            this.logger.error('ERROR OCCURRED DURING GENERATION OF JUNIPAY JWT TOKEN: ', e)
            return null;
        }
    }
}
