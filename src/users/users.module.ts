import { Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';

import { UsersService } from './services/users.service';
import { RolesService } from './services/roles.service';
import { AdminService } from './services/admin.service';

import { UsersController } from './controllers/users.controller';
import { AdminController } from './controllers/admin.controller';

@Module({
  imports: [MikroOrmModule.forFeature([User, Role])],
  controllers: [UsersController, AdminController],
  providers: [UsersService, RolesService, AdminService],
  exports: [UsersService],
})
export class UsersModule {}
