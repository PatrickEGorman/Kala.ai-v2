import {MaterialCreatedEvent, Publisher, Subjects} from "@kala.ai/common";
import {Stan} from 'node-nats-streaming'

export class MaterialCreatedPublisher extends Publisher<MaterialCreatedEvent> {
    readonly subject = Subjects.MaterialCreated;

    constructor(client: Stan) {
        super(client);
    };
};