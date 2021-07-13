import request from "supertest";
import {app} from "../../../app";
import mongoose from "mongoose";
import {natsWrapper} from "../../../nats-wrapper";
import {InvMachine} from "../../../models/InvMachine";
import {testInvMachine} from "../../../test/setup";

it('returns 404 if the invMachine_fields to update is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .post(`/api/machines/inventory/${id}`)
        .send({uptime: 10})
        .expect(404)
});

it("updates the invMachine uptime", async () => {
    const {invMachine} = await testInvMachine();

    const uptime = Math.random() * 100;

    const invMachineResponse = await request(app)
        .post(`/api/machines/inventory/${invMachine.id}`)
        .send({uptime})
        .expect(200)


    expect(invMachineResponse.body.uptime).toEqual(uptime);

    const invMachineCheck = await InvMachine.findById(invMachine.id);
    expect(invMachineCheck!.uptime).toEqual(uptime);
});

it("checks if an update event is emitted", async () => {
    const {invMachine} = await testInvMachine();

    const uptime = Math.random() * 100;

    const invMachineResponse = await request(app)
        .post(`/api/machines/inventory/${invMachine.id}`)
        .send({uptime})
        .expect(200)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});