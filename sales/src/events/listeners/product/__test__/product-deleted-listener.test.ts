import {Message} from 'node-nats-streaming';
import {ProductDeletedListener} from '../product-deleted-listener';
import {natsWrapper} from '../../../../nats-wrapper';
import {testProduct} from "../../../../test/setup";
import {ProductDeletedEvent} from "@kala.ai/common";
import {Product} from "../../../../models/Product";

const setup = async () => {
    // create an instance of the listener
    const listener = new ProductDeletedListener(natsWrapper.client);

    const product = await testProduct({})

    // create a fake data event
    const data: ProductDeletedEvent['data'] = {
        id: product.id
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return {listener, data, msg};
};

it('deletes a product', async () => {
    const {listener, data, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a product was deleted!
    const products = await Product.find();
    expect(products.length).toEqual(0);
});

it('acks the productDeleted message', async () => {
    const {data, listener, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});