import { Module } from '@nestjs/common';

import { CoreModule } from './@common/modules/core.module';
import { DbModule } from './@common/modules/db.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WalletsModule } from './wallets/wallets.module';
import { PaymentsModule } from './payments/payments.module';
import { WebhooksModule } from './webhooks/webhooks.module';

import { AppService } from './app.service';

import { AppController } from './app.controller';
import { CampaignsModule } from './campaigns/campaigns.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
