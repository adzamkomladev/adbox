import { CampaignGateway } from './campaigns/gateways/campaign.gateway';
import { Logger, Module } from '@nestjs/common';

import { CoreModule } from './@common/modules/core.module';
import { DbModule } from './@common/modules/db.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WalletsModule } from './wallets/wallets.module';
import { PaymentsModule } from './payments/payments.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { KycModule } from './kyc/kyc.module';
import { NotificationsModule } from './notifications/notifications.module';

import { AppService } from './app.service';

import { AppController } from './app.controller';

@Module({
  imports: [
    CoreModule,
    DbModule,
    UsersModule,
    AuthModule,
    WalletsModule,
    PaymentsModule,
    WebhooksModule,
    CampaignsModule,
    KycModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [Logger, AppService],
})
export class AppModule { }
