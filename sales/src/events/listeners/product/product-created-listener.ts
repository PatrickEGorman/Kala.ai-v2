import {Message, Stan} from 'node-nats-streaming';
import {Listener, NotFoundError, ProductCreatedEvent, Subjects} from "@kala.ai/common";
import {queueGroupName} from "../queue-group-name";
import {Product} from "../../../models/Product";
import {Step} from "../../../models/Step";

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
    readonly subject = Subjects.ProductCreated;
    queuedGroupName = queueGroupName;

    constructor(client: Stan) {
        super(client);
    };

    async onMessage(data: ProductCreatedEvent['data'], msg: Message) {
        const {id, name, steps, value} = data;

        let stepList = [];
        for (let step of steps) {
            const stepObj = await Step.findById(step);
            if (!stepObj) {
                throw new NotFoundError("Step")
            }
            stepList.push(stepObj);
        }

        const product = Product.build({
            _id: id,
            name,
            steps: stepList,
            value
        });
        await product.save();

        msg.ack();
        console.log(`Product ${product.id} added!`)

    }
}