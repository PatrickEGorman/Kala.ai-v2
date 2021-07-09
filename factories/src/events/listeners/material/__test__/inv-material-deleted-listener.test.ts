import {Message} from 'node-nats-streaming';
import mongoose from 'mongoose';
import {InvMaterialDeletedEvent} from '@kala.ai/common';
import {InvMaterialDeletedListener} from '../inv-material-deleted-listener';
import {natsWrapper} from '../../../../nats-wrapper';
import {InvMaterial} from "../../../../models/InvMaterial";
import {testFactory, testMaterial} from "../../../../test/setup";
import {Factory} from "../../../../models/Factory";

const setup = async () => {
    // create an instance of the listener
    const listener = new InvMaterialDeletedListener(natsWrapper.client);

    const factory = await testFactory();
    const material = await testMaterial();

    const invMaterial = InvMaterial.build({
        _id: new mongoose.Types.ObjectId().toHexString(),
        material,
        factory,
        quantity: Math.random()
    })

    await invMaterial.save();

    // create a fake data event
    const data: InvMaterialDeletedEvent['data'] = {
        id: invMaterial.id
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return {listener, data, msg, factory};
};

it('deletes a invMaterial', async () => {
    const {listener, data, msg, factory} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a invMaterial was deleted!
    const invMaterials = await InvMaterial.find();
    expect(invMaterials.length).toEqual(0);

    const factoryWithoutInv = await Factory.findById(factory.id);
    expect(factoryWithoutInv!.materials.length).toEqual(0);
});

it('acks the message', async () => {
    const {data, listener, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});