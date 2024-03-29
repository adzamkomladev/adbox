import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { resolve } from 'app-root-path';
import { FirebaseModule } from 'nestjs-firebase';

import { UsersModule } from '../users/users.module';

import { AuthService } from './auth.service';

import { JwtGuard } from './guards/jwt.guard';

import { JwtStrategy } from './strategies/jwt.strategy';

import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    FirebaseModule.forRoot({
      googleApplicationCredential: resolve('firebase-adminsdk.json'),
    }),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('auth.jwt.secret'),
        signOptions: { expiresIn: config.get('auth.jwt.expiresIn') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtGuard],
  exports: [AuthService, JwtGuard],
})
export class AuthModule {}
