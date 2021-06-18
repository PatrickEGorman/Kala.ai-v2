import {MachineDeletedEvent, Publisher, Subjects} from "@kala.ai/common";
import {Stan} from "node-nats-streaming";

export class MachineDeletedPublisher extends Publisher<MachineDeletedEvent> {
    readonly subject = Subjects.MachineDeleted;

    constructor(client: Stan) {
        super(client);
    }
}