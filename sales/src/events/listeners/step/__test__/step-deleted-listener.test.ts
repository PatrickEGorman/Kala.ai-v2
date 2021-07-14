import {Message} from 'node-nats-streaming';
import {StepDeletedListener} from '../step-deleted-listener';
import {natsWrapper} from '../../../../nats-wrapper';
import {testStep} from "../../../../test/setup";
import {StepDeletedEvent} from "@kala.ai/common";
import {Step} from "../../../../models/Step";

const setup = async () => {
    // create an instance of the listener
    const listener = new StepDeletedListener(natsWrapper.client);

    const step = await testStep({})

    // create a fake data event
    const data: StepDeletedEvent['data'] = {
        id: step.id
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return {listener, data, msg};
};

it('deletes a step', async () => {
    const {listener, data, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a step was deleted!
    const steps = await Step.find();
    expect(steps.length).toEqual(0);
});

it('acks the stepDeleted message', async () => {
    const {data, listener, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});