import {Message, Stan} from 'node-nats-streaming';
import {Listener, NotFoundError, ProductUpdatedEvent, Subjects} from "@kala.ai/common";
import {queueGroupName} from "../queue-group-name";
import {Product} from "../../../models/Product";

export class ProductUpdatedListener extends Listener<ProductUpdatedEvent> {
    readonly subject = Subjects.ProductUpdated;
    queuedGroupName = queueGroupName;

    constructor(client: Stan) {
        super(client);
    };

    async onMessage(data: ProductUpdatedEvent['data'], msg: Message) {
        const {id, value} = data;

        const product = await Product.findById(id);
        if (!product) {
            throw new NotFoundError("Product");
        }

        product.set({value})

        await product.save();

        msg.ack();
        console.log(`Product ${product.id} updated!`);

    }
}