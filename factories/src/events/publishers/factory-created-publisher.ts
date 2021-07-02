import {FactoryCreatedEvent, Publisher, Subjects} from "@kala.ai/common";
import {Stan} from 'node-nats-streaming'

export class FactoryCreatedPublisher extends Publisher<FactoryCreatedEvent> {
    readonly subject = Subjects.FactoryCreated;

    constructor(client: Stan) {
        super(client);
    };
}