import {InvMachineUpdatedEvent, Publisher, Subjects} from "@kala.ai/common";
import {Stan} from "node-nats-streaming";

export class InvMachineUpdatedPublisher extends Publisher<InvMachineUpdatedEvent> {
    readonly subject = Subjects.InvMachineUpdated;

    constructor(client: Stan) {
        super(client);
    }
}