import { Module } from '@nestjs/common';

import { CoreModule } from './@common/modules/core.module';
import { DbModule } from './@common/modules/db.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import { AppService } from './app.service';

import { AppController } from './app.controller';
import { WalletsModule } from './wallets/wallets.module';

@Module({
  imports: [CoreModule, DbModule, UsersModule, AuthModule, WalletsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
