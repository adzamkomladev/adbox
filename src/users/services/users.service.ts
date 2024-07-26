import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  FIREBASE_USER_SETUP,
  USER_CREATED,
} from '../../@common/constants/events.constant';


import { User } from '../../@common/db/entities';

import { CreateUserDto } from '../dto/create-user.dto';
import { CredentialsDto } from '../dto/credentials.dto';
import { SetRoleDto } from '../dto/set-role.dto';
import { SetExtraDetailsDto } from '../dto/set-extra-details.dto';
import { SetupFirebaseUserDto } from '../dto/setup-firebase-user.dto';
import { CreateProfile } from '../../kyc/dto/create.profile.dto';
import { QueryDto } from '../dto/query.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';

import { FirebaseUserSetupEvent } from '../events/firebase-user-setup.event';
import { UserCreatedEvent } from '../events/user.created.event';

import { UserRepository } from '../../@common/db/repositories';

@Injectable()
export class UsersService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly userRepository: UserRepository
  ) { }

  async create(payload: CreateUserDto) {
    const user = await this.userRepository.createSubscriber(payload);

    const event = new UserCreatedEvent();
    event.user = user;

    this.eventEmitter.emit(USER_CREATED, event);
    return user;
  }

  async createAdmin(payload: CreateUserDto) {
    return await this.userRepository.createAdmin(payload);
  }

  async setProfile(id: string, payload: CreateProfile) {
    const user = await this.userRepository.saveProfile(id, payload);

    if (!user) throw new BadRequestException('failed to set profile');

    return user;
  }

  async findAllAdmin({ page = 1, size = 10 }: QueryDto) {
    return await this.userRepository.findAllAdminsPaginated(page, size);
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneById(id);

    if (!user) throw new BadRequestException('failed to find user');

    return user;
  }

  async findByFirstName(firstName: string): Promise<User> {
    return await this.userRepository.findOneByFirstName(firstName);
  }
  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneByEmail(email);
  }

  async findByCredentials({ email, password }: CredentialsDto) {
    const user = await this.userRepository.findOneByCredentials(email, password);

    if (!user) throw new UnauthorizedException('Invalid credentials');
  }

  async setRole(id: string, { role: roleCode }: SetRoleDto) {
    const res = await this.userRepository.setUserRole(id, roleCode);

    if (!res) throw new BadRequestException('failed to set user role');

    const { user, role } = res;

    return {
      id: user.id,
      email: user.email,
      firebaseId: user.firebaseId,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      role: {
        id: role.id,
        code: role.code,
        name: role.name,
        title: user.roleTitle,
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async markUserPhoneAsVerified(id: string) {
    const user = await this.userRepository.markPhoneAsVerified(id);

    if (!user) throw new BadRequestException('failed to mark user phone as verified');

    return user;
  }

  async setExtraDetails(
    id: string,
    payload: SetExtraDetailsDto,
  ): Promise<User> {
    const user = await this.userRepository.saveExtraProfileDetails(id, payload);

    if (!user) throw new BadRequestException('failed to set extra details');

    return user;
  }

  async setPhoneNumber(
    id: string,
    phone: string
  ): Promise<User> {
    const user = await this.userRepository.savePhone(id, phone);

    if (!user) throw new BadRequestException('failed to set user phone number');

    return user;
  }

  async setupFirebaseUser(payload: SetupFirebaseUserDto): Promise<User> {
    const user = await this.userRepository.saveExternalAuthUser(payload);

    const event = new FirebaseUserSetupEvent();
    event.userId = user.id;
    event.hasWallet = !!user.wallet;
    event.walletBalance = payload.walletBalance;

    this.eventEmitter.emit(FIREBASE_USER_SETUP, event);

    return user;
  }

  async updateStatus(userId: string, { status }: UpdateStatusDto) {
    const success = await this.userRepository.updateStatus({ userId, status });

    if (!success) throw new BadRequestException('failed to update user status');
  }

}
