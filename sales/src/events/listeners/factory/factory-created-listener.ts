import {Message, Stan} from 'node-nats-streaming';
import {FactoryCreatedEvent, Listener, Subjects} from "@kala.ai/common";
import {queueGroupName} from "../queue-group-name";
import {Factory} from "../../../models/Factory";

export class FactoryCreatedListener extends Listener<FactoryCreatedEvent> {
    readonly subject = Subjects.FactoryCreated;
    queuedGroupName = queueGroupName;

    constructor(client: Stan) {
        super(client);
    };

    async onMessage(data: FactoryCreatedEvent['data'], msg: Message) {
        const {id, name, location} = data;

        const factory = Factory.build({
            id,
            name,
            location
        });
        await factory.save();

        msg.ack();
    }
}