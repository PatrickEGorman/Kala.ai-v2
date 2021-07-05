import {InvMaterialCreatedEvent, Publisher, Subjects} from "@kala.ai/common";
import {Stan} from 'node-nats-streaming'

export class InvMaterialCreatedPublisher extends Publisher<InvMaterialCreatedEvent> {
    readonly subject = Subjects.InvMaterialCreated;

    constructor(client: Stan) {
        super(client);
    };
};