import {InvMachineCreatedEvent, Publisher, Subjects} from "@kala.ai/common";
import {Stan} from 'node-nats-streaming'

export class InvMachineCreatedPublisher extends Publisher<InvMachineCreatedEvent> {
    readonly subject = Subjects.InvMachineCreated;

    constructor(client: Stan) {
        super(client);
    };
}