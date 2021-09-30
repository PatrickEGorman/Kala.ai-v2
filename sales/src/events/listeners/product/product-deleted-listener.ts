import {Message, Stan} from 'node-nats-streaming';
import {Listener, NotFoundError, ProductDeletedEvent, Subjects} from "@kala.ai/common";
import {queueGroupName} from "../queue-group-name";
import {Product} from "../../../models/Product";

export class ProductDeletedListener extends Listener<ProductDeletedEvent> {
    readonly subject = Subjects.ProductDeleted;
    queuedGroupName = queueGroupName;

    constructor(client: Stan) {
        super(client);
    };

    async onMessage(data: ProductDeletedEvent['data'], msg: Message) {
        const {id} = data;

        const product = await Product.findById(id);
        if (!product) {
            throw new NotFoundError("Product");
        }

        await product.delete();

        msg.ack();
        console.log(`Product ${product.id} deleted!`);
    }
}