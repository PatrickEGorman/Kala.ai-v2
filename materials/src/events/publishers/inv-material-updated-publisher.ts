import {InvMaterialUpdatedEvent, Publisher, Subjects} from "@kala.ai/common";
import {Stan} from "node-nats-streaming";

export class InvMaterialUpdatedPublisher extends Publisher<InvMaterialUpdatedEvent> {
    readonly subject = Subjects.InvMaterialUpdated;

    constructor(client: Stan) {
        super(client);
    }
}