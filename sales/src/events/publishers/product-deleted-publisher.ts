import {ProductDeletedEvent, Publisher, Subjects} from "@kala.ai/common";
import {Stan} from "node-nats-streaming";

export class ProductDeletedPublisher extends Publisher<ProductDeletedEvent> {
    readonly subject = Subjects.ProductDeleted;

    constructor(client: Stan) {
        super(client);
    }
}