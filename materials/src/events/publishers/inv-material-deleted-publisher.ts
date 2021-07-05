import {InvMaterialDeletedEvent, Publisher, Subjects} from "@kala.ai/common";
import {Stan} from "node-nats-streaming";

export class InvMaterialDeletedPublisher extends Publisher<InvMaterialDeletedEvent> {
    readonly subject = Subjects.InvMaterialDeleted;

    constructor(client: Stan) {
        super(client);
    }
}