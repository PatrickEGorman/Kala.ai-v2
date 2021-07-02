import {Message} from 'node-nats-streaming';
import mongoose from 'mongoose';
import {MaterialCreatedEvent} from '@kala.ai/common';
import {MaterialCreatedListener} from '../material-created-listener';
import {natsWrapper} from '../../../nats-wrapper';
import {Material} from "../../../models/Material";

const setup = async () => {
    // create an instance of the listener
    const listener = new MaterialCreatedListener(natsWrapper.client);

    // create a fake data event
    const data: MaterialCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        name: 'plastic',
        cost: 10,
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return {listener, data, msg};
};

it('creates and saves a material', async () => {
    const {listener, data, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a material was created!
    const material = await Material.findById(data.id);

    expect(material).toBeDefined();
    expect(material!.name).toEqual(data.name);
});

it('acks the message', async () => {
    const {data, listener, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});
