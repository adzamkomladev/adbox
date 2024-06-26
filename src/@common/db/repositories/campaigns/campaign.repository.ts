import { Injectable, Logger } from '@nestjs/common';

import { EntityManager, FilterQuery } from '@mikro-orm/postgresql';
import { Campaign, User } from '../../entities';

import { Status } from '../../../enums/status.enum';
import { Campaign as TimelineCampaign } from '../../../../campaigns/dto/get.timeline.dto';


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

        const dataQuery = this.em.findAll(
            Campaign,
            {
                where: filter,
                offset: size * (page - 1),
                limit: size,
                orderBy: {
                    createdAt: 'desc'
                },
                fields: ['id', 'name', 'description', 'asset', 'status', 'start', 'end', 'likes', 'views']
            }
        );
        const countQuery = this.em.count(
            Campaign,
            filter
        );

        const [data, total] = await Promise.all([dataQuery, countQuery]);

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

}
