import {Message, Stan} from 'node-nats-streaming';
import {InvMaterialCreatedEvent, Listener, NotFoundError, Subjects} from "@kala.ai/common";
import {queueGroupName} from "../queue-group-name";
import {InvMaterial} from "../../../models/InvMaterial";
import {Factory} from "../../../models/Factory";

export class InvMaterialCreatedListener extends Listener<InvMaterialCreatedEvent> {
    readonly subject = Subjects.InvMaterialCreated;
    queuedGroupName = queueGroupName;

    constructor(client: Stan) {
        super(client);
    };

    async onMessage(data: InvMaterialCreatedEvent['data'], msg: Message) {
        const {id, materialId, factoryId, quantity} = data;

        const factory = await Factory.findById(factoryId);

        if (!factory) {
            throw new NotFoundError("Factory")
        }

        const invMaterial = InvMaterial.build({
            _id: id,
            factory,
            material: materialId,
            quantity
        });
        await invMaterial.save();

        factory.materials.push(invMaterial);
        await factory.save();

        msg.ack();
        console.log(`InvMaterial ${invMaterial.id} added!`)

    }
}