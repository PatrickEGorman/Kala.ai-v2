import {StepUpdatedEvent, Publisher, Subjects} from "@kala.ai/common";
import {Stan} from "node-nats-streaming";

export class StepUpdatedPublisher extends Publisher<StepUpdatedEvent> {
    readonly subject = Subjects.StepUpdated;

    constructor(client: Stan) {
        super(client);
    }
}