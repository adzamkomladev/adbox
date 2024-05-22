import { Injectable, Logger } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';

import { Server } from 'socket.io';

import { SendCampaignInteractionDto } from '../dto/send.campaign.interaction.dto';
import { AuthService } from '../../auth/auth.service';


@Injectable()
@WebSocketGateway(60002)
export class CampaignGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private readonly logger = new Logger(CampaignGateway.name);

    constructor(private readonly auth: AuthService) { }

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('events')
    handleEvent(@MessageBody() data: any) {
        this.server.emit('events', { message: "nice message", data });
    }

    sendCampaignInteraction(userId: string, payload: SendCampaignInteractionDto) {
        this.server.emit(`campaign.interaction.${userId}`, payload);
    }

    handleConnection(client: any, ...args: any[]) {
        this.logger.log('User connected', client?.handshake?.headers);
    }

    handleDisconnect(client: any) {
        this.logger.log('User disconnected');
    }

    afterInit(server: any) {
        this.logger.log('Socket is live')
    }
}
