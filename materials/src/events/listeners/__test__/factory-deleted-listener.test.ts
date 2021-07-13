import {Message} from 'node-nats-streaming';
import {FactoryDeletedEvent} from '@kala.ai/common';
import {FactoryDeletedListener} from '../factory-deleted-listener';
import {natsWrapper} from '../../../nats-wrapper';
import {Factory} from "../../../models/Factory";
import {testInvMaterial} from "../../../test/setup";
import {InvMaterial} from "../../../models/InvMaterial";

const setup = async () => {
    // create an instance of the listener
    const listener = new FactoryDeletedListener(natsWrapper.client);

    const {invMaterial, factory} = await testInvMaterial();

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

    return {listener, data, msg, factory, invMaterial};
};

it('deletes a factory', async () => {
    const {listener, data, msg, factory} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a factory was deleted!
    const factories = await Factory.find();
    expect(factories.length).toEqual(0);

    const invMaterials = await InvMaterial.find();
    expect(invMaterials.length).toEqual(0);
});

it('acks the message', async () => {
    const {data, listener, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});