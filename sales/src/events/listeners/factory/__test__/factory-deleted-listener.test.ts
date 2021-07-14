import {Message} from 'node-nats-streaming';
import {FactoryDeletedEvent} from '@kala.ai/common';
import {FactoryDeletedListener} from '../factory-deleted-listener';
import {natsWrapper} from '../../../../nats-wrapper';
import {Factory} from "../../../../models/Factory";
import {testFactory} from "../../../../test/setup";

const setup = async () => {
    // create an instance of the listener
    const listener = new FactoryDeletedListener(natsWrapper.client);

    const factory = await testFactory({});

    // create a fake data event
    const data: FactoryDeletedEvent['data'] = {
        id: factory.id,
        cost: 20
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return {listener, data, msg, factory};
};

it('deletes a factory', async () => {
    const {listener, data, msg, factory} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a factory was deleted!
    const factories = await Factory.find();
    expect(factories.length).toEqual(0);
});

it('acks the message', async () => {
    const {data, listener, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});