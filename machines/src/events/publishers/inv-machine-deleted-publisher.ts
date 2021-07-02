import {InvMachineDeletedEvent, Publisher, Subjects} from "@kala.ai/common";
import {Stan} from "node-nats-streaming";

export class InvMachineDeletedPublisher extends Publisher<InvMachineDeletedEvent> {
    readonly subject = Subjects.InvMachineDeleted;

    constructor(client: Stan) {
        super(client);
    }
}