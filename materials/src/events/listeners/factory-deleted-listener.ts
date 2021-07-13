import {Message, Stan} from 'node-nats-streaming';
import {FactoryDeletedEvent, Listener, NotFoundError, Subjects} from "@kala.ai/common";
import {queueGroupName} from "./queue-group-name";
import {Factory} from "../../models/Factory";
import {InvMaterialDeletedPublisher} from "../publishers/inv-material-deleted-publisher";
import {natsWrapper} from "../../nats-wrapper";

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

        for (let m in factory.materials) {
            await new InvMaterialDeletedPublisher(natsWrapper.client).publish({id: factory.materials[m].id})

            await factory.materials[m].delete();
        }

        await factory.delete();

        msg.ack();
    }
}