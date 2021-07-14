import {Message, Stan} from 'node-nats-streaming';
import {InvMaterialUpdatedEvent, Listener, NotFoundError, Subjects} from "@kala.ai/common";
import {queueGroupName} from "../queue-group-name";
import {InvMaterial} from "../../../models/InvMaterial";
import {Factory} from "../../../models/Factory";

export class InvMaterialUpdatedListener extends Listener<InvMaterialUpdatedEvent> {
    readonly subject = Subjects.InvMaterialUpdated;
    queuedGroupName = queueGroupName;

    constructor(client: Stan) {
        super(client);
    };

    async onMessage(data: InvMaterialUpdatedEvent['data'], msg: Message) {
        const {id, factoryId, quantity} = data;

        const factory = await Factory.findById(factoryId);

        if (!factory) {
            throw new NotFoundError("Factory")
        }

        const invMaterial = await InvMaterial.findById(id);
        if (!invMaterial) {
            throw new NotFoundError("Inventory Material");
        }
        if (invMaterial.factory.id.toString() !== factoryId) {
            let factory = await Factory.findById(invMaterial.factory);
            if (!factory) {
                throw new NotFoundError("Factory")
            }
            const index = factory.materials.indexOf(invMaterial);
            factory.materials.splice(index);
            await factory.save();

            factory = await Factory.findById(factoryId);
            if (!factory) {
                throw new NotFoundError("Factory");
            }
            factory.materials.push(invMaterial);
            await factory.save();
        }

        invMaterial.set({factory, quantity: quantity + invMaterial.quantity})

        await invMaterial.save();

        msg.ack();
        console.log(`InvMaterial ${invMaterial.id} updated!`)

    }
}