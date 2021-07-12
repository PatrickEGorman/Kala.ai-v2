import {Message, Stan} from 'node-nats-streaming';
import {FactoryDeletedEvent, Listener, NotFoundError, Subjects} from "@kala.ai/common";
import {queueGroupName} from "./queue-group-name";
import {Factory} from "../../models/Factory";
import {natsWrapper} from "../../nats-wrapper";
import {InvMachineDeletedPublisher} from "../publishers/inv-machine-deleted-publisher";

export class FactoryDeletedListener extends Listener<FactoryDeletedEvent> {
    readonly subject = Subjects.FactoryDeleted;
    queuedGroupName = queueGroupName;

    constructor(client: Stan) {
        super(client);
    };

    async onMessage(data: FactoryDeletedEvent['data'], msg: Message) {
        const {id} = data;

        const factory = await Factory.findById(id).populate("machines");

        if (!factory) {
            throw new NotFoundError("Factory")
        }

        for (let m of factory.machines) {
            await new InvMachineDeletedPublisher(natsWrapper.client).publish({id: m.id})

            await m.delete();
        }

        await factory.delete();

        msg.ack();
    }
}