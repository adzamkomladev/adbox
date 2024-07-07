export class CampaignCreatedEvent {
    constructor(public campaignId: string, public transactionId: string) { }
}