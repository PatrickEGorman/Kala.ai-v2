import {MaterialUpdatedEvent, Publisher, Subjects} from "@kala.ai/common";
import {Stan} from "node-nats-streaming";

export class MaterialUpdatedPublisher extends Publisher<MaterialUpdatedEvent> {
    readonly subject = Subjects.MaterialUpdated;

    constructor(client: Stan) {
        super(client);
    }
}