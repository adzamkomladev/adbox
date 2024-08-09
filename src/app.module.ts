import { Module } from '@nestjs/common';

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

import { OpenTelemetryModule } from 'nestjs-otel';

const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
  metrics: {
    hostMetrics: true, // Includes Host Metrics
    apiMetrics: {
      enable: true, // Includes api metrics
      defaultAttributes: {
        // You can set default labels for api metrics
        custom: 'label',
      },
      ignoreRoutes: ['/favicon.ico'], // You can ignore specific routes (See https://docs.nestjs.com/middleware#excluding-routes for options)
      ignoreUndefinedRoutes: false, //Records metrics for all URLs, even undefined ones
      // prefix: 'my_prefix', // Add a custom prefix to all API metrics
    },
  },
});


@Module({
  imports: [
    OpenTelemetryModuleConfig,
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
  providers: [AppService],
})
export class AppModule { }
