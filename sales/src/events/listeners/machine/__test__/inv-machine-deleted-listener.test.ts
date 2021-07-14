import {Message} from 'node-nats-streaming';
import {InvMachineDeletedEvent} from '@kala.ai/common';
import {InvMachineDeletedListener} from '../inv-machine-deleted-listener';
import {natsWrapper} from '../../../../nats-wrapper';
import {InvMachine} from "../../../../models/InvMachine";
import {testFactory, testInvMachine} from "../../../../test/setup";
import {Factory} from "../../../../models/Factory";

const setup = async () => {
    // create an instance of the listener
    const listener = new InvMachineDeletedListener(natsWrapper.client);

    const factory = await testFactory({});
    const invMachine = await testInvMachine({factory});

    // create a fake data event
    const data: InvMachineDeletedEvent['data'] = {
        id: invMachine.id
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return {listener, data, msg, factory};
};

it('deletes a invMachine', async () => {
    const {listener, data, msg, factory} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a invMachine was deleted!
    const invMachines = await InvMachine.find();
    expect(invMachines.length).toEqual(0);

    const factoryWithoutInv = await Factory.findById(factory.id);
    expect(factoryWithoutInv!.machines.length).toEqual(0);
});

it('acks the invMachineDeleted message', async () => {
    const {data, listener, msg} = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});