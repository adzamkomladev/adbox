import { Module } from '@nestjs/common';

import { UsersService } from './services/users.service';
import { RolesService } from './services/roles.service';

import { UsersController } from './controllers/users.controller';
import { AdminController } from './controllers/admin.controller';

@Module({
  controllers: [UsersController, AdminController],
  providers: [UsersService, RolesService],
  exports: [UsersService],
})
export class UsersModule {}
