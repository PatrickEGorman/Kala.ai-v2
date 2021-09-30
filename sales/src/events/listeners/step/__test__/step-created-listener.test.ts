import {Message} from 'node-nats-streaming';
import mongoose from 'mongoose';
import {StepCreatedListener} from '../step-created-listener';
import {natsWrapper} from '../../../../nats-wrapper';
import {StepCreatedEvent} from "@kala.ai/common";
import {Step} from "../../../../models/Step";

const setup = async () => {
    // create an instance of the listener
    const listener = new StepCreatedListener(natsWrapper.client);

    const machine = mongoose.Types.ObjectId().toHexString();
    const material = mongoose.Types.ObjectId().toHexString();

    // create a fake data event
    const data: StepCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        machineId: machine,
        materialId: material,
        quantity: 10,
        stepTime: 20
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return {listener, data, msg, material, machine};
};

it('creates and saves a step', async () => {
    const {listener, data, msg, material, machine} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a step was created!
    const step = await Step.findById(data.id);

    expect(step).toBeDefined();
    expect(step!.id.toString()).toEqual(data.id);
    expect(step!.material!.toString()).toEqual(material);
    expect(step!.machine!.toString()).toEqual(machine);
    expect(step!.quantity).toEqual(data.quantity);
    expect(step!.stepTime).toEqual(data.stepTime);
});

it('acks the stepCreated message', async () => {
    const {data, listener, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});