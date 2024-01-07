import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { CreateRequestContext, MikroORM } from "@mikro-orm/core";

import { FIREBASE_USER_SETUP } from "@common/constants/events.constant";

import { FirebaseUserSetupEvent } from "@app/users/events/firebase-user-setup.event";

import { WalletsService } from "../wallets.service";

@Injectable()
export class FirebaseUserSetupListener {
    private readonly logger = new Logger(FirebaseUserSetupListener.name);

    constructor(private readonly orm: MikroORM, private readonly walletsService: WalletsService) { }

    @OnEvent(FIREBASE_USER_SETUP, { async: true })
    @CreateRequestContext()
    async handleUserCreated(event: FirebaseUserSetupEvent) {
        this.logger.log('DATA RECEIVED', event);

        const { hasWallet, userId, walletBalance } = event;

        if (hasWallet) {
            this.logger.log('HANDLING COMPLETE');
            return;
        }

        await this.walletsService.create({ userId, balance: walletBalance });

        this.logger.log('HANDLING COMPLETE');
    }
}
