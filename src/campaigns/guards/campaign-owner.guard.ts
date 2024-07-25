import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { CampaignsService } from '../campaigns.service';

@Injectable()
export class CampaignOwnerGuard implements CanActivate {
  constructor(private readonly campaignsService: CampaignsService) { }
  // TODO: MUST BE FIXED
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const authUser = request.user;
    const campaignId = request.params?.id;

    if (!authUser || !campaignId) return false;

    return await this.campaignsService.checkIfCampaignBelongsToUser(campaignId, authUser);
  }
}
