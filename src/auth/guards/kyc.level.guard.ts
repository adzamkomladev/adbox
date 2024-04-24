import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Observable } from 'rxjs';

import { KycLevels } from '../../@common/decorators/kyc.levels.decorator';

import { KycLevel } from '../../@common/enums/kyc.level.enum';

import { AuthenticatedUser } from '../../@common/dto/authenticated.user.dto';

@Injectable()
export class KycLevelGuard implements CanActivate {

  constructor(private reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(context.switchToHttp().getRequest().user)
    const kycLevels = this.reflector.get(KycLevels, context.getHandler());

    if (!kycLevels) {
      return true;
    }

    const user: AuthenticatedUser = context.switchToHttp().getRequest().user;
    return this.matchesLevels(kycLevels, user);
  }

  private matchesLevels(kycLevels: KycLevel[], user: AuthenticatedUser) {
    return kycLevels.includes(user.kyc.level);
  }
}
