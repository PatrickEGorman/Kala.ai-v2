import {FactoryUpdatedEvent, Publisher, Subjects} from "@kala.ai/common";
import {Stan} from "node-nats-streaming";

export class FactoryUpdatedPublisher extends Publisher<FactoryUpdatedEvent> {
    readonly subject = Subjects.FactoryUpdated;

    constructor(client: Stan) {
        super(client);
    }
}