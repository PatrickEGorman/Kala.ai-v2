import {MachineUpdatedEvent, Publisher, Subjects} from "@kala.ai/common";
import {Stan} from "node-nats-streaming";

export class MachineUpdatedPublisher extends Publisher<MachineUpdatedEvent> {
    readonly subject = Subjects.MachineUpdated;

    constructor(client: Stan) {
        super(client);
    }
}