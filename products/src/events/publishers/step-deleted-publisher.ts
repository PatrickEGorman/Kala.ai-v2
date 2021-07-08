import {StepDeletedEvent, Publisher, Subjects} from "@kala.ai/common";
import {Stan} from "node-nats-streaming";

export class StepDeletedPublisher extends Publisher<StepDeletedEvent> {
    readonly subject = Subjects.StepDeleted;

    constructor(client: Stan) {
        super(client);
    }
}