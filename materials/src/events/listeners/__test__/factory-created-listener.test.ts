import {Message} from 'node-nats-streaming';
import mongoose from 'mongoose';
import {FactoryCreatedEvent} from '@kala.ai/common';
import {FactoryCreatedListener} from '../factory-created-listener';
import {natsWrapper} from '../../../nats-wrapper';
import {Factory} from "../../../models/Factory";

const setup = async () => {
    // create an instance of the listener
    const listener = new FactoryCreatedListener(natsWrapper.client);

    // create a fake data event
    const data: FactoryCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        name: 'plastic',
        location: {lat: 25, long: 47},
        storage: 20,
        maintenanceCost: 30,
        maintenanceTime: 25,
        cost: 400
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return {listener, data, msg};
};

it('creates and saves a factory', async () => {
    const {listener, data, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a factory was created!
    const factory = await Factory.findById(data.id);

    expect(factory).toBeDefined();
    expect(factory!.name).toEqual(data.name);
});

it('acks the message', async () => {
    const {data, listener, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});
