import {MaterialDeletedEvent, Publisher, Subjects} from "@kala.ai/common";
import {Stan} from "node-nats-streaming";

export class MaterialDeletedPublisher extends Publisher<MaterialDeletedEvent> {
    readonly subject = Subjects.MaterialDeleted;

    constructor(client: Stan) {
        super(client);
    }
}