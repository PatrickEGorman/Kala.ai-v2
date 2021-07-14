import {Message} from 'node-nats-streaming';
import {ProductUpdatedListener} from '../product-updated-listener';
import {natsWrapper} from '../../../../nats-wrapper';
import {testProduct} from "../../../../test/setup";
import {ProductUpdatedEvent} from "@kala.ai/common";
import {Product} from "../../../../models/Product";

const setup = async () => {
    // create an instance of the listener
    const listener = new ProductUpdatedListener(natsWrapper.client);

    const product = await testProduct({})

    let value = Math.random() * 100 + 1;

    // create a fake data event
    const data: ProductUpdatedEvent['data'] = {
        id: product.id,
        value
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return {listener, data, msg, product};
};

it('updates and saves a product', async () => {
    const {listener, data, msg, product} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a product was updated!
    const productUp = await Product.findById(data.id);

    expect(productUp).toBeDefined();
    expect(productUp!.id.toString()).toEqual(product.id);
    expect(productUp!.value).toEqual(data.value);
});

it('acks the productUpdated message', async () => {
    const {data, listener, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});