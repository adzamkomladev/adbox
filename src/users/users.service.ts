import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { CreateRequestContext, EntityRepository, MikroORM, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';

import { Status } from '../@common/enums/status.enum';

import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { CredentialsDto } from './dto/credentials.dto';
import { SetRoleDto } from './dto/set-role.dto';
import { SetExtraDetailsDto } from './dto/set-extra-details.dto';
import { SetupFirebaseUserDto } from './dto/setup-firebase-user.dto';
import {
  FIREBASE_USER_SETUP,
  USER_CREATED,
} from '../@common/constants/events.constant';
import { FirebaseUserSetupEvent } from './events/firebase-user-setup.event';
import { UserCreatedEvent } from './events/user.created.event';

@Injectable()
export class UsersService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  @CreateRequestContext()
  async create(payload: CreateUserDto) {
    const user = this.usersRepository.create(payload);
    await this.em.persistAndFlush(user);

    const event = new UserCreatedEvent();
    event.user = user;

    this.eventEmitter.emit(USER_CREATED, event);

    await this.em.populate(user, ['wallet']);

    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string): Promise<User> {
    return await this.usersRepository.findOneOrFail(id);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ email }, { populate: ['wallet'] });
  }

  async findByCredentials({ email, password }: CredentialsDto) {
    const user = await this.usersRepository.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await user.validatePassword(password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async setRole(id: string, { role }: SetRoleDto): Promise<User> {
    const user = this.usersRepository.findOneOrFail(id);

    wrap(user).assign({ role });
    await this.em.persistAndFlush(user);

    return user;
  }

  async setExtraDetails(
    id: string,
    { dateOfBirth, country }: SetExtraDetailsDto,
  ): Promise<User> {
    const user = this.usersRepository.findOneOrFail(id);

    wrap(user).assign({ dateOfBirth, country, status: Status.ACTIVE });
    await this.em.persistAndFlush(user);

    return user;
  }

  async setupFirebaseUser({
    firebaseId,
    avatar,
    email,
    name,
    walletBalance,
  }: SetupFirebaseUserDto): Promise<User> {
    let user = await this.usersRepository.findOne({ firebaseId });

    if (user) {
      wrap(user).assign({ avatar, email, name });
    } else {
      user = this.usersRepository.create({ firebaseId, avatar, email, name });
    }

    await this.em.persistAndFlush(user);

    const event = new FirebaseUserSetupEvent();
    event.userId = user.id;
    event.hasWallet = !!user.wallet;
    event.walletBalance = walletBalance;

    this.eventEmitter.emit(FIREBASE_USER_SETUP, event);

    return user;
  }
}
