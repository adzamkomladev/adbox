import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../interfaces/jwt.payload';
import { AuthService } from '../auth.service';
import { use } from 'passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService, private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: config.get<boolean>('auth.jwt.ignoreExpiration'),
      secretOrKey: config.get('auth.jwt.secret'),
      usernameField: 'id'
    });
  }

  async validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      userId: payload.sub,
      username: payload.email,
      email: payload.email,
      kyc: payload.kyc,
      role: payload.role,
      isPhoneVerified: payload.isPhoneVerified
    };
  }
}
