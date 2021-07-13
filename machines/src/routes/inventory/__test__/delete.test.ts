import request from "supertest";
import {app} from "../../../app";
import mongoose from "mongoose";
import {InvMachine} from "../../../models/InvMachine";
import {natsWrapper} from "../../../nats-wrapper";
import {testInvMachine} from "../../../test/setup";

it('returns 404 if the invMachine to delete is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .delete(`/api/machines/inventory/${id}`)
        .expect(404)
});


it("deletes an existing invMachine", async () => {
    const {invMachine} = await testInvMachine();

    await request(app)
        .delete(`/api/machines/inventory/${invMachine.id}`)
        .send()
        .expect(200)

    const invMachines = await InvMachine.find()
    expect(invMachines.length).toEqual(0)
});


it("checks if a delete event is emitted", async () => {
    const {invMachine} = await testInvMachine();

    await request(app)
        .delete(`/api/machines/inventory/${invMachine.id}`)
        .send()
        .expect(200)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});