import {StepCreatedEvent, Publisher, Subjects} from "@kala.ai/common";
import {Stan} from 'node-nats-streaming'

export class StepCreatedPublisher extends Publisher<StepCreatedEvent> {
    readonly subject = Subjects.StepCreated;

    constructor(client: Stan) {
        super(client);
    };
}