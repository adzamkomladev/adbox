import { Global, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigService } from '@nestjs/config';
import { Campaign, Interaction, Role, User, Webhook } from '../db/entities';

@Global()
@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        ...config.get('db'),
      }),
    }),
    MikroOrmModule.forFeature([
      User,
      Role,
      Webhook,
      Campaign,
      Interaction
    ])
  ],
})
export class DbModule {}
