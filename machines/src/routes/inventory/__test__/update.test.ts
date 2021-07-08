import request from "supertest";
import {app} from "../../../app";
import mongoose from "mongoose";
import {natsWrapper} from "../../../nats-wrapper";
import {InvMachine} from "../../../models/InvMachine";

it('returns 404 if the invMachine_fields to update is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .post(`/api/machines/inventory/${id}`)
        .send({uptime: 10})
        .expect(404)
});

it("updates the invMachine uptime", async () => {
    const {machine, factory} = await global.invTestObj();

    const response = await request(app)
        .post('/api/machines/inventory')
        .send({
            machine: machine._id, factory: factory._id
        })

    const uptime = Math.random() * 100;

    const invMachineResponse = await request(app)
        .post(`/api/machines/inventory/${response.body.id}`)
        .send({uptime})
        .expect(200)


    expect(invMachineResponse.body.uptime).toEqual(uptime);

    const invMachine = await InvMachine.findById(response.body.id);
    expect(invMachine!.uptime).toEqual(uptime);
});

it("checks if an update event is emitted", async () => {
    const {machine, factory} = await global.invTestObj();

    const response = await request(app)
        .post('/api/machines/inventory')
        .send({
            machine: machine._id, factory: factory._id
        })

    const invMachineResponse = await request(app)
        .post(`/api/machines/inventory/${response.body.id}`)
        .send({uptime: 10})

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});