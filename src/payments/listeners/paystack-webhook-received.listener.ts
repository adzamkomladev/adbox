import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';


import { Queue } from 'bullmq';
import { PAYSTACK_WEBHOOK_RECEIVED } from '../../@common/constants/events.constant';
import { PROCESS_PAYMENT_QUEUE } from '../constants/queues.constant';

import { PaystackWebhookReceivedEvent } from '../../webhooks/events/paystack-webhook-received.event';

import { OtlpLogger } from '../../@common/loggers/otlp.logger';

@Injectable()
export class PaystackWebhookReceivedListener {
    private readonly logger = new OtlpLogger(PaystackWebhookReceivedListener.name);
    constructor(
        @InjectQueue(PROCESS_PAYMENT_QUEUE)
        private readonly processPaymentQueue: Queue,
    ) { }

    @OnEvent(PAYSTACK_WEBHOOK_RECEIVED, { async: true })
    async handlePaystackWebhookReceivedEvent(event: PaystackWebhookReceivedEvent) {
        const { event: paystackEvent, data } = event;

        if (paystackEvent === 'charge.success') {
            await this.processPaymentQueue.add(PROCESS_PAYMENT_QUEUE, { reference: data.reference, status: data.status });
            return;
        }
    }
}
