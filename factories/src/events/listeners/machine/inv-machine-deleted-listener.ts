import {Message, Stan} from 'node-nats-streaming';
import {InvMachineDeletedEvent, Listener, NotFoundError, Subjects} from "@kala.ai/common";
import {queueGroupName} from "../queue-group-name";
import {InvMachine} from "../../../models/InvMachine";
import {Factory} from "../../../models/Factory";

export class InvMachineDeletedListener extends Listener<InvMachineDeletedEvent> {
    readonly subject = Subjects.InvMachineDeleted;
    queuedGroupName = queueGroupName;

    constructor(client: Stan) {
        super(client);
    };

    async onMessage(data: InvMachineDeletedEvent['data'], msg: Message) {
        const {id} = data;

        const invMachine = await InvMachine.findById(id);
        if (!invMachine) {
            throw new NotFoundError("Inventory Material")
        }

        let factory = await Factory.findById(invMachine.factory);
        if (!factory) {
            throw new NotFoundError("Factory")
        }
        const index = factory.machines.indexOf(invMachine);
        factory.materials.splice(index);
        await factory.save();

        await invMachine.delete();


        msg.ack();
        console.log(`InvMachine ${invMachine.id} deleted!`)
    }
}