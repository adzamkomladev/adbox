import { Module } from '@nestjs/common';

import { CoreModule } from './@common/modules/core.module';
import { DbModule } from './@common/modules/db.module';

import { AppService } from './app.service';

import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [CoreModule, DbModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
