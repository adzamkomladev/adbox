import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

import { Status } from '../@common/enums/status.enum';

import { JwtPayload } from './interfaces/jwt.payload';

import { AuthenticateDto } from './dto/authenticate.dto';
import { AuthenticatedDto } from './dto/authenticated.dto';
import { LoginDto } from './dto/login.dto';

import { UsersService } from '../users/services/users.service';
import { User } from '../users/entities/user.entity';
import { identity } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    private readonly usersService: UsersService,
  ) { }

  async authenticate({ idToken, firstName, lastName }: AuthenticateDto): Promise<AuthenticatedDto> {
    let decodedToken: Partial<DecodedIdToken>;

    try {
      // decodedToken = await this.firebase.auth.verifyIdToken(idToken);

      decodedToken = {
        email: 'pinkmal@yopmail.com',
        name: 'Pink Mal',
        given_name: 'Pink',
        family_name: 'Mal',
        picture: 'https://ui-avatars.com/api/?name=Pink+Mal',
        uid: '123456789',
      };
    } catch (e) {
      throw new BadRequestException('failed to decode firebase id token');
    }

    if (!decodedToken) {
      throw new BadRequestException('failed to decode firebase id token');
    }

    // const decodedToken = {
    //   email: 'pinkmal@yopmail.com',
    //   name: 'Pink Mal',
    //   picture: 'https://ui-avatars.com/api/?name=Pink+Mal',
    // };

    let user = await this.usersService.findByEmail(decodedToken.email);

    if (!user) {
      const newFirstName = firstName || decodedToken.given_name;
      const newLastName = lastName || decodedToken.family_name;
      const newAvatar = `https://ui-avatars.com/api/?name=${newFirstName}+${newLastName}`;
      user = await this.usersService.create({
        email: decodedToken.email,
        firstName: newFirstName,
        lastName: newLastName,
        avatar: newAvatar,
        firebaseId: decodedToken.uid,
        status: Status.ACTIVE,
      });
    }

    const payload: JwtPayload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isPhoneVerified: !!user.phoneVerifiedAt,
      phone: user.phone,
      avatar: user.avatar,
      status: user.status,
      walletId: user.wallet?.id,
      accessToken,
    };
  }

  async login({ email, password, rememberMe }: LoginDto) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await user.validatePassword(password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: rememberMe ? this.config.get('auth.jwt.rememberMeExpiresIn') : this.config.get('auth.jwt.expiresIn'),
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      status: user.status,
      walletId: user.wallet?.id,
      accessToken,
    };
  }

  async getFullUserData(payload: User) {
    const user = await this.usersService.findOne(payload.id);

    const attempts = await user.kyc?.attempts?.matching({
      orderBy: { createdAt: 'desc' },
    }) || [];
    const levelTwo = attempts?.find(attempt => attempt.level === 2);
    const levelFour = attempts?.find(attempt => attempt.level === 4);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
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
      } : null,
      role: user.role,
    }
  }
}
