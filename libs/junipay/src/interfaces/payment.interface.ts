import { Channel } from "../enums/channel.enum";
import { Provider } from "../enums/provider.enum";

export interface Request {
    channel: Channel;
    phoneNumber: string;
    provider: Provider;
    amount: number;
    senderEmail: string;
    description: string;
    reference: string;
}