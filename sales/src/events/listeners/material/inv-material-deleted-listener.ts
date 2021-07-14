import {Message, Stan} from 'node-nats-streaming';
import {InvMaterialDeletedEvent, Listener, NotFoundError, Subjects} from "@kala.ai/common";
import {queueGroupName} from "../queue-group-name";
import {InvMaterial} from "../../../models/InvMaterial";
import {Factory} from "../../../models/Factory";

export class InvMaterialDeletedListener extends Listener<InvMaterialDeletedEvent> {
    readonly subject = Subjects.InvMaterialDeleted;
    queuedGroupName = queueGroupName;

    constructor(client: Stan) {
        super(client);
    };

    async onMessage(data: InvMaterialDeletedEvent['data'], msg: Message) {
        const {id} = data;

        const invMaterial = await InvMaterial.findById(id);
        if (!invMaterial) {
            throw new NotFoundError("Inventory Material")
        }

        let factory = await Factory.findById(invMaterial.factory);
        if (!factory) {
            throw new NotFoundError("Factory")
        }
        const index = factory.materials.indexOf(invMaterial);
        factory.materials.splice(index);
        await factory.save();

        await invMaterial.delete();


        msg.ack();
        console.log(`InvMaterial ${invMaterial.id} deleted!`)
    }
}