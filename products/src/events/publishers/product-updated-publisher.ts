import {ProductUpdatedEvent, Publisher, Subjects} from "@kala.ai/common";
import {Stan} from "node-nats-streaming";

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
    readonly subject = Subjects.ProductUpdated;

    constructor(client: Stan) {
        super(client);
    }
}