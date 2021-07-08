import request from 'supertest'
import {app} from "../../../app";
import {InvMachine} from "../../../models/InvMachine";
import {natsWrapper} from "../../../nats-wrapper";
import {invTestObj} from "../../../test/setup";

it('has a route handler listening to /api/machines/inventory for post requests', async () => {
    const response = await request(app)
        .post('/api/machines/inventory')
        .send({});

    expect(response.status).not.toEqual(404);
});

it('returns an error if an invalid data is provided', async () => {
    await request(app)
        .post('/api/machines/inventory')
        .send({})
        .expect(400)
});

it('creates a invMachine with valid inputs', async () => {
    let invMachines = await InvMachine.find({});
    expect(invMachines.length).toEqual(0)

    const {material, machine, factory} = await invTestObj();
    const response = await request(app)
        .post('/api/machines/inventory')
        .send({
            machine: machine._id, factory: factory._id
        }).expect(201)

    invMachines = await InvMachine.find({});
    expect(invMachines.length).toEqual(1)

    expect(invMachines[0].id.toString()).toEqual(response.body.id);
    expect(invMachines[0].material._id).toEqual(material._id);
    expect(invMachines[0].factory._id).toEqual(factory._id);
    expect(invMachines[0].machine._id).toEqual(machine._id);
});


it('makes sure create event is published', async () => {
    const {machine, factory} = await invTestObj();

    await request(app)
        .post('/api/machines/inventory')
        .send({
            machine: machine._id, factory: factory._id
        })

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
