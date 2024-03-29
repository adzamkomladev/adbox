import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UsersModule } from '../users/users.module';

import { Kyc } from './entities/kyc.entity';
import { Attempt } from './entities/attempt.entity';
import { Identity } from './entities/identity.entity';
import { Business } from './entities/business.entity';

import { KycService } from './kyc.service';

import { KycController } from './controllers/kyc.controller';
import { AdminController } from './controllers/admin.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Kyc, Attempt, Business, Identity]), UsersModule],
  controllers: [KycController, AdminController],
  providers: [KycService],
})
export class KycModule { }
