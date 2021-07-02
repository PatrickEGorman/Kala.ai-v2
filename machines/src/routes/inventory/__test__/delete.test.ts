import request from "supertest";
import {app} from "../../../app";
import mongoose from "mongoose";
import {InvMachine} from "../../../models/InvMachine";
import {natsWrapper} from "../../../nats-wrapper";

it('returns 404 if the invMachine to delete is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .delete(`/api/machines/inventory/${id}`)
        .expect(404)
});


it("deletes an existing invMachine", async () => {
    const {machine, factory} = await global.invTestObj();

    const response = await request(app)
        .post('/api/machines/inventory')
        .send({
            machine: machine._id, factory: factory._id
        })

    await request(app)
        .delete(`/api/machines/inventory/${response.body.id}`)
        .send()
        .expect(200)

    const invMachines = await InvMachine.find()
    expect(invMachines.length).toEqual(0)
});


it("checks if a delete event is emitted", async () => {
    const {machine, factory} = await global.invTestObj();

    const response = await request(app)
        .post('/api/machines/inventory')
        .send({
            machine: machine._id, factory: factory._id
        })

    await request(app)
        .delete(`/api/machines/inventory/${response.body.id}`)
        .send()

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});