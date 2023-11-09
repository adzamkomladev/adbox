import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';

import { Status } from '../@common/enums/status.enum';

import { JwtPayload } from './interfaces/jwt.payload';

import { AuthenticateDto } from './dto/authenticate.dto';
import { AuthenticatedDto } from './dto/authenticated.dto';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    private readonly usersService: UsersService,
  ) {}

  async authenticate({ idToken }: AuthenticateDto): Promise<AuthenticatedDto> {
    const decodedToken = await this.firebase.auth.verifyIdToken(idToken);
    // const decodedToken = {
    //   email: 'pinkmal@yopmail.com',
    //   name: 'Pink Mal',
    //   picture: 'https://ui-avatars.com/api/?name=Pink+Mal',
    // };

    let user = await this.usersService.findByEmail(decodedToken.email);

    if (!user) {
      user = await this.usersService.create({
        email: decodedToken.email,
        name: decodedToken.name,
        avatar: decodedToken.picture,
        firebaseId: decodedToken.uid,
        status: Status.ACTIVE,
      });
    }

    const payload: JwtPayload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      status: user.status,
      walletId: user.wallet?.id,
      accessToken,
    };
  }
}
