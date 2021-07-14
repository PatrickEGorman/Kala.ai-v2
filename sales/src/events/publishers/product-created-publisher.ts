import {ProductCreatedEvent, Publisher, Subjects} from "@kala.ai/common";
import {Stan} from 'node-nats-streaming'

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
    readonly subject = Subjects.ProductCreated;

    constructor(client: Stan) {
        super(client);
    };
}