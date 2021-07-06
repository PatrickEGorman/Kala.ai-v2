import {Message, Stan} from 'node-nats-streaming';
import {Listener, MachineCreatedEvent, NotFoundError, Subjects} from "@kala.ai/common";
import {queueGroupName} from "../queue-group-name";
import {Machine} from "../../../models/Machine";
import {Material} from "../../../models/Material";

export class MachineCreatedListener extends Listener<MachineCreatedEvent> {
    readonly subject = Subjects.MachineCreated;
    queuedGroupName = queueGroupName;

    constructor(client: Stan) {
        super(client);
    };

    async onMessage(data: MachineCreatedEvent['data'], msg: Message) {
        const {id, name, material} = data;

        const materialObj = await Material.findById(material);

        if (!materialObj) {
            throw new NotFoundError("Material");
        }

        const machine = Machine.build({
            id,
            name,
            material: materialObj
        });
        await machine.save();

        msg.ack();
    }
}