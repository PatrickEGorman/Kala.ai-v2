import {Message, Stan} from 'node-nats-streaming';
import {InvMachineCreatedEvent, Listener, NotFoundError, Subjects} from "@kala.ai/common";
import {queueGroupName} from "../queue-group-name";
import {InvMachine} from "../../../models/InvMachine";
import {Factory} from "../../../models/Factory";
import {Machine} from "../../../models/Machine";

export class InvMachineCreatedListener extends Listener<InvMachineCreatedEvent> {
    readonly subject = Subjects.InvMachineCreated;
    queuedGroupName = queueGroupName;

    constructor(client: Stan) {
        super(client);
    };

    async onMessage(data: InvMachineCreatedEvent['data'], msg: Message) {
        const {id, machineId, factoryId} = data;

        const factory = await Factory.findById(factoryId);
        const machine = await Machine.findById(machineId);

        if (!factory) {
            throw new NotFoundError("Factory")
        }

        if (!machine) {
            throw new NotFoundError("Machine")
        }

        const invMachine = await InvMachine.build({
            _id: id,
            factory,
            machine
        });
        await invMachine.save();

        factory.machines.push(invMachine);
        await factory.save();

        msg.ack();
        console.log(`InvMachine ${invMachine.id} added!`)
    }
}