import {Message} from 'node-nats-streaming';
import {StepUpdatedListener} from '../step-updated-listener';
import {natsWrapper} from '../../../../nats-wrapper';
import {testStep} from "../../../../test/setup";
import {StepUpdatedEvent} from "@kala.ai/common";
import {Step} from "../../../../models/Step";

const setup = async () => {
    // create an instance of the listener
    const listener = new StepUpdatedListener(natsWrapper.client);

    const step = await testStep({})

    let quantity = Math.random() * 100 + 1;
    let stepTime = Math.random() * 100 + 1;

    // create a fake data event
    const data: StepUpdatedEvent['data'] = {
        id: step.id,
        quantity,
        stepTime
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return {listener, data, msg, step};
};

it('updates and saves a step', async () => {
    const {listener, data, msg, step} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a step was updated!
    const stepUp = await Step.findById(data.id);

    expect(stepUp).toBeDefined();
    expect(stepUp!.id.toString()).toEqual(step.id);
    expect(stepUp!.quantity).toEqual(data.quantity);
    expect(stepUp!.stepTime).toEqual(data.stepTime);
});

it('acks the stepUpdated message', async () => {
    const {data, listener, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});