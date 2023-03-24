import { Injectable, UnauthorizedException } from '@nestjs/common';

import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { CredentialsDto } from './dto/credentials.dto';
import { SetRoleDto } from './dto/set-role.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.persistAndFlush(user);
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOneOrFail(id);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ email });
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

    await wrap(user).assign({ role });
    await this.usersRepository.persistAndFlush(user);

    return user;
  }
}
