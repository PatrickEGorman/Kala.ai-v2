import {Message} from 'node-nats-streaming';
import {InvMaterialUpdatedEvent} from '@kala.ai/common';
import {InvMaterialUpdatedListener} from '../inv-material-updated-listener';
import {natsWrapper} from '../../../../nats-wrapper';
import {InvMaterial} from "../../../../models/InvMaterial";
import {testFactory, testInvMaterial} from "../../../../test/setup";
import {Factory} from "../../../../models/Factory";

const setup = async () => {
    // create an instance of the listener
    const listener = new InvMaterialUpdatedListener(natsWrapper.client);

    const factory = await testFactory({});

    const invMaterial = await testInvMaterial({factory})

    let quantity = Math.random() * 100 + 1;
    const factoryTwo = await testFactory({name: "Factory Two", location: {lat: 35, long: 35}});

    // create a fake data event
    const data: InvMaterialUpdatedEvent['data'] = {
        id: invMaterial.id,
        factoryId: factoryTwo.id,
        quantity
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return {listener, data, msg, factoryTwo, factory, invMaterial};
};

it('updates and saves a invMaterial', async () => {
    const {listener, data, msg, factoryTwo, factory, invMaterial} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a invMaterial was updated!
    const invMaterialUp = await InvMaterial.findById(data.id);

    expect(invMaterialUp).toBeDefined();
    expect(invMaterialUp!.id.toString()).toEqual(invMaterial.id);
    expect(invMaterialUp!.factory.toString()).toEqual(factoryTwo.id);
    expect(invMaterialUp!.quantity).toEqual(data.quantity + invMaterial.quantity);

    const factoryWithInv = await Factory.findById(factoryTwo.id);
    expect(factoryWithInv!.materials[0].toString()).toEqual(invMaterial.id);

    const factoryWithoutInv = await Factory.findById(factory.id);
    expect(factoryWithoutInv!.materials.length).toEqual(0);
});

it('acks the invMaterialUpdated message', async () => {
    const {data, listener, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});