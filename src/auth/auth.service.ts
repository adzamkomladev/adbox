import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import * as uniqid from 'uniqid';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

import { USER_CREATED } from '../@common/constants/events.constant';

import { Status } from '../@common/enums/status.enum';

import { JwtPayload } from './interfaces/jwt.payload';

import { User } from '../@common/db/entities/users/user.entity';

import { AuthenticateDto } from './dto/authenticate.dto';
import { AuthenticatedDto, AuthenticatedUser } from './dto/authenticated.dto';
import { LoginDto } from './dto/login.dto';

import { UserCreatedEvent } from '../users/events/user.created.event';

import { UserRepository } from '../@common/db/repositories';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
    @InjectFirebaseAdmin()
    private readonly firebase: FirebaseAdmin,
    private readonly userRepository: UserRepository
  ) { }

  async jwtAuthentication(token?: string) {
    if (!token) {
      throw new UnauthorizedException('invalid authentication token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.config.get('auth.jwt.secret'),
        }
      );
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      return payload;
    } catch {
      throw new UnauthorizedException('invalid authentication token');
    }
  }
  async authenticate({ idToken, firstName, lastName }: AuthenticateDto): Promise<AuthenticatedDto> {
    let decodedToken: Partial<DecodedIdToken>;

    try {
      decodedToken = await this.firebase.auth.verifyIdToken(idToken);

      // const user = await this.userRepository.findOneByFirstName(firstName);
      // console.log(user)
      // decodedToken = {
      //   email: user.email,
      //   name: 'Victor Adele',
      //   given_name: user.firstName,
      //   family_name: user.lastName,
      //   picture: user.avatar,
      //   uid: uniqid(),
      // };
    } catch (e) {
      this.logger.error(`Failed to decode firebase id token: ${e.message}`);
      throw new UnauthorizedException('Failed to authenticate user');
    }

    if (!decodedToken) {
      throw new BadRequestException('Failed to authenticate user');
    }

    // const decodedToken = {
    //   email: 'pinkmal@yopmail.com',
    //   name: 'Pink Mal',
    //   picture: 'https://ui-avatars.com/api/?name=Pink+Mal',
    // };

    let user: User = await this.userRepository.findOneByEmail(decodedToken.email);

    if (!user) {
      const newFirstName = firstName || decodedToken.given_name;
      const newLastName = lastName || decodedToken.family_name;
      const newAvatar = `https://ui-avatars.com/api/?name=${newFirstName}+${newLastName}`;
      user = await this.userRepository.createSubscriber({
        email: decodedToken.email,
        firstName: newFirstName,
        lastName: newLastName,
        avatar: newAvatar,
        firebaseId: decodedToken.uid,
        status: Status.ACTIVE,
      });

      const event = new UserCreatedEvent();
      event.user = user;

      this.eventEmitter.emit(USER_CREATED, event);
    }

    const payload = await this.generateJwtPayload(user);
    const accessToken = this.jwtService.sign(payload);

    return {
      user: this.formatUserData(user),
      accessToken,
    };
  }

  async login({ email, password, rememberMe }: LoginDto) {
    const user = await this.userRepository.findOneByCredentials(email, password);

    if (!user) throw new UnauthorizedException('invalid credentials');

    const payload = await this.generateJwtPayload(user);
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: rememberMe ? this.config.get('auth.jwt.rememberMeExpiresIn') : this.config.get('auth.jwt.expiresIn'),
    });

    return {
      user: this.formatUserData(user),
      accessToken,
    };
  }

  async getFullUserData(payload: User) {
    const user = await this.userRepository.findOneById(payload.id);

    return this.formatUserData(user);
  }

  private formatUserData(user: User): AuthenticatedUser {
    const attempts = user.kyc?.attempts || [];
    const levelTwo = attempts?.find(attempt => attempt.level === 2);
    const levelFour = attempts?.find(attempt => attempt.level === 4);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      avatar: user.avatar,
      status: user.status,
      wallet: user.wallet,
      phone: user.phone,
      isPhoneVerified: !!user.phoneVerifiedAt,
      kyc: user?.kyc ? {
        id: user.kyc?.id,
        level: user.kyc?.level,
        identity: user.kyc?.identity,
        business: user.kyc?.business,
        attempts: {
          latest: attempts?.[0] || null,
          total: attempts?.length,
        },
        levels: {
          level1: {
            status: user?.kyc?.level === 1 ? Status.APPROVED : Status.NOT_STARTED
          },
          level2: {
            status: levelTwo?.status || Status.NOT_STARTED

          },
          level4: {
            status: levelFour?.status || Status.NOT_STARTED
          }
        }
      } : null,
      role: {
        id: user.role.id,
        name: user.role.name,
        code: user.role.code,
      },
    }
  }

  private async generateJwtPayload(user: User): Promise<JwtPayload> {
    const attempts = user.kyc?.attempts || [];
    const levelTwo = attempts?.find(attempt => attempt.level === 2);
    const levelFour = attempts?.find(attempt => attempt.level === 4);

    return {
      email: user.email,
      sub: user.id,
      isPhoneVerified: !!user.phoneVerifiedAt,
      role: {
        id: user.role.id,
        name: user.role.name,
        code: user.role.code,
      },
      kyc: user.kyc ? {
        level: user.kyc?.level,
        levels: [
          {
            level: 1,
            status: user?.kyc?.level === 1 ? Status.APPROVED : Status.NOT_STARTED
          },
          {
            level: 2,
            status: levelTwo?.status || Status.NOT_STARTED
          },
          {
            level: 4,
            status: levelFour?.status || Status.NOT_STARTED
          }
        ]
      } : null
    };
  }
}
