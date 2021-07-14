import {Message} from 'node-nats-streaming';
import mongoose from 'mongoose';
import {ProductCreatedListener} from '../product-created-listener';
import {natsWrapper} from '../../../../nats-wrapper';
import {ProductCreatedEvent} from "@kala.ai/common";
import {Product} from "../../../../models/Product";
import {testStep} from "../../../../test/setup";

const setup = async () => {
    // create an instance of the listener
    const listener = new ProductCreatedListener(natsWrapper.client);

    const stepOne = await testStep({});
    const stepTwo = await testStep({});
    const value = Math.random();
    const name = "Test Product"

    // create a fake data event
    const data: ProductCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        name,
        steps: [stepOne.id, stepTwo.id],
        value
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return {listener, data, msg};
};

it('creates and saves a product', async () => {
    const {listener, data, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a product was created!
    const product = await Product.findById(data.id);

    expect(product).toBeDefined();
    expect(product!.id.toString()).toEqual(data.id);
    expect(product!.name).toEqual(data.name);
    expect(product!.value).toEqual(data.value);
    expect(product!.steps[0].toString()).toEqual(data.steps[0]);
    expect(product!.steps[1].toString()).toEqual(data.steps[1]);
});

it('acks the productCreated message', async () => {
    const {data, listener, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});