import {Message} from 'node-nats-streaming';
import mongoose from 'mongoose';
import {MachineCreatedEvent} from '@kala.ai/common';
import {MachineCreatedListener} from '../machine-created-listener';
import {natsWrapper} from '../../../../nats-wrapper';
import {Machine} from "../../../../models/Machine";
import {testMaterial} from "../../../../test/setup";

const setup = async () => {
    // create an instance of the listener
    const listener = new MachineCreatedListener(natsWrapper.client);

    const material = await testMaterial();

    // create a fake data event
    const data: MachineCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        name: 'cnc',
        maintenanceTime: 20,
        maintenanceCost: 30,
        initialCost: 40,
        laborCost: 50,
        material: material.id,
        errorRate: .05,
        operationCost: 60
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return {listener, data, msg, material};
};

it('creates and saves a machine', async () => {
    const {listener, data, msg, material} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a machine was created!
    const machine = await Machine.findById(data.id);

    expect(machine).toBeDefined();
    expect(machine!.name).toEqual(data.name);
    expect(machine!.material._id.toString()).toEqual(material.id);
});

it('acks the machine created message', async () => {
    const {data, listener, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});
