import {Message} from 'node-nats-streaming';
import mongoose from 'mongoose';
import {InvMachineCreatedEvent} from '@kala.ai/common';
import {InvMachineCreatedListener} from '../inv-machine-created-listener';
import {natsWrapper} from '../../../../nats-wrapper';
import {InvMachine} from "../../../../models/InvMachine";
import {testFactory} from "../../../../test/setup";
import {Factory} from "../../../../models/Factory";

const setup = async () => {
    // create an instance of the listener
    const listener = new InvMachineCreatedListener(natsWrapper.client);

    const factory = await testFactory({});

    // create a fake data event
    const data: InvMachineCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        factoryId: factory.id,
        machineId: mongoose.Types.ObjectId().toHexString()
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return {listener, data, msg, factory};
};

it('creates and saves a invMachine', async () => {
    const {listener, data, msg, factory} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a invMachine was created!
    const invMachine = await InvMachine.findById(data.id);

    expect(invMachine).toBeDefined();
    expect(invMachine!.id.toString()).toEqual(data.id);
    expect(invMachine!.machine.toString()).toEqual(data.machineId);
    expect(invMachine!.factory.toString()).toEqual(factory.id);

    const factoryWithInv = await Factory.findById(factory.id);

    expect(factoryWithInv!.machines[0].toString()).toEqual(data.id);
});

it('acks the invMachineCreated message', async () => {
    const {data, listener, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});