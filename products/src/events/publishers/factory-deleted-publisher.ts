import {FactoryDeletedEvent, Publisher, Subjects} from "@kala.ai/common";
import {Stan} from "node-nats-streaming";

export class FactoryDeletedPublisher extends Publisher<FactoryDeletedEvent> {
    readonly subject = Subjects.FactoryDeleted;

    constructor(client: Stan) {
        super(client);
    }
}