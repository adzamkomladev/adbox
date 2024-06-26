import { Injectable, Logger } from '@nestjs/common';

import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Campaign, Interaction, User } from '../../entities';

import { Status } from '../../../enums/status.enum';


@Injectable()
export class InteractionRepository {
    private readonly logger = new Logger(InteractionRepository.name);

    constructor(private readonly em: EntityManager) { }

    async saveInteraction(userId: string, campaignId: string, payload: any) {
        let campaign = await this.em.findOne(Campaign, { id: campaignId });

        if (!campaign) return null;

        let interaction = await this.em.findOne(
            Interaction,
            {
                user: { id: userId },
                campaign: { id: campaign.id }
            }
        );

        if (!interaction) {
            interaction = this.em.create(Interaction, {
                campaign,
                user: this.em.getReference(User, userId),
                liked: false,
                views: 0,
                credit: payload.view ? campaign.perInteractionCost : 0,
            });
        }

        if (payload.toggleLike) {
            const res = this.likeInteraction(interaction, campaign);

            interaction = res.interaction;
            campaign = res.campaign;
        }

        if (payload.view) {
            const res = this.viewInteraction(interaction, campaign);

            interaction = res.interaction;
            campaign = res.campaign;
        }

        await this.em.persistAndFlush([interaction, campaign]);

        return { campaign, interaction };
    }

    private likeInteraction(interaction: Interaction, campaign: Campaign) {
        const liked = !interaction.liked;

        wrap(interaction).assign({
            liked
        });

        wrap(campaign).assign({
            likes: liked ? campaign.likes + 1 : campaign.likes - 1
        });

        return { interaction, campaign };
    }

    private viewInteraction(interaction: Interaction, campaign: Campaign) {
        wrap(interaction).assign({
            views: interaction.views + 1,
            credit: interaction.views === 0 ? campaign.perInteractionCost : interaction.credit
        });

        wrap(campaign).assign({
            views: campaign.views + 1
        });

        return { interaction, campaign };
    }
}
