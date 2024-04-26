import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Observable } from 'rxjs';

import { JwtPayload } from '../interfaces/jwt.payload';

@Injectable()
export class PhoneVerifiedGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const user: JwtPayload = context.switchToHttp().getRequest().user;

    return user?.isPhoneVerified;
  }
}
