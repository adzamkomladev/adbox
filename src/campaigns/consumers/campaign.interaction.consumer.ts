import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { CreateRequestContext, MikroORM } from "@mikro-orm/core";

import { EntityManager } from '@mikro-orm/postgresql';
import { Job } from 'bullmq';

import { CAMPAIGN_INTERACTION_QUEUE } from '../constants/queues.constant';

import { Status } from '../../@common/enums/status.enum';

import { User, Campaign, Interaction } from '../../@common/db/entities';

import { CampaignInteractionJobDto } from '../dto/campaign.interaction.job.dto';

import { CampaignGateway } from '../gateways/campaign.gateway';

@Processor(CAMPAIGN_INTERACTION_QUEUE)
export class CampaignInteractionConsumer extends WorkerHost {
    private readonly logger = new Logger(CampaignInteractionConsumer.name);

    constructor(
        private readonly orm: MikroORM,
        private readonly em: EntityManager,
        private readonly campaignGateway: CampaignGateway
    ) { super(); }

    @CreateRequestContext()
    async process(job: Job<CampaignInteractionJobDto>) {
        this.logger.log('Start campaign interaction...');

        const { campaignId } = job.data;
        const campaign = await this.em.findOne(
            Campaign,
            { id: campaignId },
            { fields: ['name', 'views', 'likes', 'targetAge', 'demographic'] }
        );

        if (!campaign) {
            this.logger.error(`Campaign with id: ${campaignId} not found`);
            return false;
        }

        const { name, views, likes, targetAge, demographic } = campaign;

        let hasMore = true;
        let skip = 0;

        const batchProcessingSize: number = 100;
        while (hasMore) {
            const users =
                await this.em.findAll(
                    User,
                    {
                        where: {
                            status: Status.ACTIVE,
                            kyc: {
                                country: demographic,
                            }
                        },
                        limit: batchProcessingSize,
                        offset: skip,
                        orderBy: { createdAt: 'ASC' },
                        fields: [
                            'campaignInteractions.views',
                            'campaignInteractions.liked',
                            'campaignInteractions.liked'
                        ],
                        populateWhere: {
                            campaignInteractions: {
                                campaign: { id: campaign.id },
                            }
                        }
                    }
                );

            console.log(users)
            if (users.length === 0) {
                hasMore = false;
            } else {
                for (const user of users) {
                    try {
                        const { views: interactionViews, liked } = user.campaignInteractions?.[0] || null;

                        await this.sendCampaignInteractionUpdate(
                            { id: campaignId, name, views, likes },
                            { user: { id: user.id }, views: interactionViews || 0, liked }
                        );
                    } catch (error) {
                        this.logger.error(
                            `Failed to send campaign interaction update:  ${error}`,
                        );
                    }
                }
                skip += users.length;
            }
        }
    }

    private async sendCampaignInteractionUpdate(campaign: Partial<Campaign>, interaction: Pick<Interaction, 'liked' | 'views'> & { user: Pick<User, 'id'> }) {
        try {
            this.campaignGateway.sendCampaignInteraction(
                interaction.user.id,
                {
                    campaignId: campaign.id,
                    views: campaign.views,
                    likes: campaign.likes,
                    liked: !!interaction.liked,
                    campaignName: campaign.name,
                    viewed: interaction.views > 0,
                    currentTime: new Date()
                }
            );
        } catch (error) {
            this.logger.error('Error sending campaign interaction', error);
        }
    }
}
