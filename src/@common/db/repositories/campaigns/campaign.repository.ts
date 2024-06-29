import { Injectable, Logger } from '@nestjs/common';

import { EntityManager, FilterQuery, wrap } from '@mikro-orm/postgresql';
import { Campaign, User } from '../../entities';

import { Status } from '../../../enums/status.enum';
import { Campaign as TimelineCampaign } from '../../../../campaigns/dto/get.timeline.dto';
import { Campaign as CreatedCampaign } from '../../../../campaigns/dto/get-created-campaigns.dto';


@Injectable()
export class CampaignRepository {
    private readonly logger = new Logger(CampaignRepository.name);

    constructor(private readonly em: EntityManager) { }

    async create(userId: string, data: any) {
        // TODO: Perform balance checks

        const user = await this.em.findOne(User, { id: userId });

        if (!user) return null;

        const campaign = this.em.create(Campaign, {
            name: data.name,
            description: data.description,
            demographic: 'GH',
            targetAge: data.targetAge,
            targetReach: data.targetReach,
            budget: data.budget * 100,
            start: data.start,
            end: data.end,
            status: Status.ACTIVE,
            asset: data.link,
            user: user,
            perInteractionCost: data.budget * 100 / data.targetReach,
        });

        await this.em.persistAndFlush(campaign);

        return campaign;
    }

    async getUserTimeline(userId: string, query: any) {
        const page = query.page || 1;
        const size = query.size || 20;

        const user = await this.em.findOne(
            User,
            { id: userId },
            { fields: ['age', 'kyc.country'] }
        );

        if (!user) return null;

        const filter: FilterQuery<Campaign> = {
            status: Status.ACTIVE,
            targetAge: { $lte: user.age },
            demographic: user.kyc?.country
        };

        const [data, total] = await this.em.findAndCount(
            Campaign,
            filter,
            {
                offset: size * (page - 1),
                limit: size,
                orderBy: {
                    createdAt: 'desc'
                },
                fields: ['id', 'name', 'description', 'asset', 'status', 'start', 'end', 'likes', 'views']
            }
        );

        return {
            data: data as TimelineCampaign[],
            meta: {
                page,
                size,
                total,
                totalPage: Math.ceil(total / size),
            }
        };
    }

    async getCreatedCampaigns(userId: string, query: any) {
        const page = query.page || 1;
        const size = query.size || 10;

        const [data, total] = await this.em.qb(Campaign)
            .select([
                'id',
                'name',
                'demographic',
                'targetAge',
                'status',
                "JSON_BUILD_OBJECT('value', views + likes, 'change', 'none') as impressions",
                "JSON_BUILD_OBJECT('value', views + likes, 'change', 'none') as crt",
                "JSON_BUILD_OBJECT('value', views, 'change', 'none') as uniqueViews",
            ])
            .where({ user: { id: userId } })
            .orderBy({
                status: 'asc',
                createdAt: 'desc'
            })
            .limit(size)
            .offset(size * (page - 1))
            .getResultAndCount();


        return {
            data: data as any[],
            meta: {
                page,
                size,
                total,
                totalPage: Math.ceil(total / size),
            }
        };
    }

    async pauseCampaign(campaignId: string, pausedBy: string) {
        const campaign = await this.em.findOne(Campaign, { id: campaignId, status: Status.ACTIVE });

        if (!campaign) return null;

        wrap(campaign).assign({
            status: Status.PAUSED
        });

        await this.em.persistAndFlush(campaign);

        return campaign;
    }

    async unPauseCampaign(campaignId: string, unPausedBy: string) {
        const campaign = await this.em.findOne(Campaign, { id: campaignId, status: Status.PAUSED });

        if (!campaign) return null;

        wrap(campaign).assign({
            status: Status.ACTIVE
        });

        await this.em.persistAndFlush(campaign);

        return campaign;
    }

    async stopCampaign(campaignId: string, stoppedBy: string) {
        const campaign = await this.em.findOne(Campaign, { id: campaignId, status: { $in: [Status.PAUSED, Status.ACTIVE] } });

        if (!campaign) return null;

        wrap(campaign).assign({
            status: Status.STOPPED
        });

        await this.em.persistAndFlush(campaign);

        return campaign;
    }

    async findOneByIdAndOwner(campaignId: string, ownedBy: string) {
        return await this.em.findOne(Campaign, { id: campaignId, user: { id: ownedBy } }, { fields: ['id', 'name', 'status'] });
    }
}
