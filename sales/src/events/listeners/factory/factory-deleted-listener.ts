import {Message, Stan} from 'node-nats-streaming';
import {FactoryDeletedEvent, Listener, NotFoundError, Subjects} from "@kala.ai/common";
import {queueGroupName} from "../queue-group-name";
import {Factory} from "../../../models/Factory";

export class FactoryDeletedListener extends Listener<FactoryDeletedEvent> {
    readonly subject = Subjects.FactoryDeleted;
    queuedGroupName = queueGroupName;

    constructor(client: Stan) {
        super(client);
    };

    async onMessage(data: FactoryDeletedEvent['data'], msg: Message) {
        const {id} = data;

        const factory = await Factory.findById(id).populate("materials");

        if (!factory) {
            throw new NotFoundError("Factory")
        }

        await factory.delete();

        msg.ack();
    }
}