export class SendCampaignInteractionDto {
    readonly campaignId: string;
    readonly campaignName: string;
    readonly views: number;
    readonly viewed: boolean;
    readonly likes: number;
    readonly liked: boolean;
    readonly currentTime = new Date();
}