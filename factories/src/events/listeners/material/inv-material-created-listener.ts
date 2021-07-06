import {Message, Stan} from 'node-nats-streaming';
import {InvMaterialCreatedEvent, Listener, NotFoundError, Subjects} from "@kala.ai/common";
import {queueGroupName} from "../queue-group-name";
import {InvMaterial} from "../../../models/InvMaterial";
import {Factory} from "../../../models/Factory";
import {Material} from "../../../models/Material";

export class InvMaterialCreatedListener extends Listener<InvMaterialCreatedEvent> {
    readonly subject = Subjects.InvMaterialCreated;
    queuedGroupName = queueGroupName;

    constructor(client: Stan) {
        super(client);
    };

    async onMessage(data: InvMaterialCreatedEvent['data'], msg: Message) {
        const {id, materialId, factoryId, quantity} = data;

        const factory = await Factory.findById(factoryId);
        const material = await Material.findById(materialId);

        if (!factory) {
            throw new NotFoundError("Factory")
        }

        if (!material) {
            throw new NotFoundError("Material")
        }

        const invMaterial = InvMaterial.build({
            _id: id,
            factory,
            material,
            quantity
        });
        await invMaterial.save();

        factory.materials.push(invMaterial);
        await factory.save();

        msg.ack();
    }
}