import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { CreateRequestContext, MikroORM } from "@mikro-orm/core";

import { EntityManager } from '@mikro-orm/postgresql';
import { Job } from 'bull';

import { CAMPAIGN_INTERACTION_QUEUE } from '../constants/queues.constant';

import { Interaction } from '../entities/interaction.entity';

import { CampaignInteractionJobDto } from '../dto/campaign.interaction.job.dto';
import { CampaignGateway } from '../gateways/campaign.gateway';
import { Campaign } from '../entities/campaign.entity';

@Processor(CAMPAIGN_INTERACTION_QUEUE)
export class CampaignInteractionConsumer {
    private readonly logger = new Logger(CampaignInteractionConsumer.name);

    constructor(
        private readonly orm: MikroORM,
        private readonly em: EntityManager,
        private readonly campaignGateway: CampaignGateway
    ) { }

    @Process()
    @CreateRequestContext()
    async handleCampaignInteraction(job: Job<CampaignInteractionJobDto>) {
        this.logger.log('Start campaign interaction...');
        const { interactionId } = job.data;


        const interaction = await this.em.findOne(
            Interaction,
            { id: interactionId },
            { fields: ['views', 'campaign.id', 'campaign.name', 'user.id'] }
        );

        // TODO: Credit wallet of subscriber
        await this.sendCampaignInteractionUpdate(interaction);

        this.logger.log('Campaign interaction completed');
    }

    private async sendCampaignInteractionUpdate(interaction: any) {
        try {
            const likesQuery = this.em.qb(Interaction)
                .count('liked')
                .where({
                    campaign: { id: interaction.campaign.id },
                    liked: true
                })
                .execute();
            const viewsQuery = this.em.qb(Interaction)
                .count('views')
                .where({
                    campaign: { id: interaction.campaign.id },
                    views: { $gt: 0 }
                })
                .execute();
            const likedQuery = this.em.findOne(
                Interaction,
                {
                    campaign: { id: interaction.campaign.id },
                    liked: true,
                    user: { id: interaction.user.id },
                },
                { fields: ['liked'] }
            );

            const [likesRes, viewsRes, likedRes] = await Promise.all([likesQuery, viewsQuery, likedQuery]);
            const { count: likes } = likesRes?.[0];
            const { count: views } = viewsRes?.[0];

            this.campaignGateway.sendCampaignInteraction(
                interaction.user.id,
                {
                    campaignId: interaction.campaign.id,
                    views,
                    likes,
                    liked: !!likedRes?.liked,
                    campaignName: interaction.campaign.name,
                    viewed: interaction.views > 0,
                    currentTime: new Date()
                }
            );
        } catch (error) {
            this.logger.error('Error sending campaign interaction', error);
        }
    }
}
