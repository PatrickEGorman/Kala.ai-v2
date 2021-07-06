import {Message} from 'node-nats-streaming';
import mongoose from 'mongoose';
import {InvMaterialCreatedEvent} from '@kala.ai/common';
import {InvMaterialCreatedListener} from '../inv-material-created-listener';
import {natsWrapper} from '../../../../nats-wrapper';
import {InvMaterial} from "../../../../models/InvMaterial";
import {testFactory, testMaterial} from "../../../../test/setup";
import {Factory} from "../../../../models/Factory";

const setup = async () => {
    // create an instance of the listener
    const listener = new InvMaterialCreatedListener(natsWrapper.client);

    const factory = await testFactory();
    const material = await testMaterial();

    // create a fake data event
    const data: InvMaterialCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        factoryId: factory.id,
        materialId: material.id,
        quantity: 10
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return {listener, data, msg, factory, material};
};

it('creates and saves a invMaterial', async () => {
    const {listener, data, msg, material, factory} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a invMaterial was created!
    const invMaterial = await InvMaterial.findById(data.id);

    expect(invMaterial).toBeDefined();
    expect(invMaterial!.material.toString()).toEqual(material.id);
    expect(invMaterial!.factory.toString()).toEqual(factory.id);
    expect(invMaterial!.quantity).toEqual(data.quantity);

    const factoryWithInv = await Factory.findById(factory.id);

    expect(factoryWithInv!.materials[0].toString()).toEqual(data.id);
});

it('acks the message', async () => {
    const {data, listener, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});