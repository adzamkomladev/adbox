import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../interfaces/jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: config.get<boolean>('auth.jwt.ignoreExpiration'),
      secretOrKey: config.get('auth.jwt.secret'),
    });
  }

  async validate(payload: JwtPayload) {
    return { id: payload.sub, email: payload.email };
  }
}
