import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';

import { Kyc } from './entities/kyc.entity';
import { Attempt } from './entities/attempt.entity';
import { Identity } from './entities/identity.entity';
import { Business } from './entities/business.entity';

import { KycService } from './services/kyc.service';

import { KycController } from './controllers/kyc.controller';
import { AdminController } from './controllers/admin.controller';
import { PhoneVerificationService } from './services/phone-verification.service';

@Module({
  imports: [MikroOrmModule.forFeature([Kyc, Attempt, Business, Identity]), UsersModule, NotificationsModule],
  controllers: [KycController, AdminController],
  providers: [KycService, PhoneVerificationService],
})
export class KycModule { }
