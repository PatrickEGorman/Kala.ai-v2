import {Message, Stan} from 'node-nats-streaming';
import {Listener, MaterialCreatedEvent, Subjects} from "@kala.ai/common";
import {queueGroupName} from "./queue-group-name";
import {Material} from "../../models/Material";

export class MaterialCreatedListener extends Listener<MaterialCreatedEvent> {
    readonly subject = Subjects.MaterialCreated;
    queuedGroupName = queueGroupName;

    constructor(client: Stan) {
        super(client);
    };

    async onMessage(data: MaterialCreatedEvent['data'], msg: Message) {
        const {id, name, cost} = data;

        const material = Material.build({
            id,
            name
        });
        await material.save();

        msg.ack();
    }
}