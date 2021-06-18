import {MachineCreatedEvent, Publisher, Subjects} from "@kala.ai/common";
import {Stan} from 'node-nats-streaming'

export class MachineCreatedPublisher extends Publisher<MachineCreatedEvent> {
    readonly subject = Subjects.MachineCreated;

    constructor(client: Stan) {
        super(client);
    };
}