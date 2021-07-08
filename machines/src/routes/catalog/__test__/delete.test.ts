import request from "supertest";
import {app} from "../../../app";
import mongoose from "mongoose";
import {Machine} from "../../../models/Machine";
import {natsWrapper} from "../../../nats-wrapper";
import {machineParams} from "../../../test/setup";

it('returns 404 if the machine to delete is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .delete(`/api/machines/catalog/${id}`)
        .expect(404)
});


it("deletes an existing machine", async () => {
    const params = await machineParams();

    const response = await request(app)
        .post('/api/machines/catalog')
        .send(
            params
        )

    await request(app)
        .delete(`/api/machines/catalog/${response.body.id}`)
        .send()
        .expect(200)

    const machines = await Machine.find()
    expect(machines.length).toEqual(0)
});


it("checks if a delete event is emitted", async () => {
    const params = await machineParams();

    const response = await request(app)
        .post('/api/machines/catalog')
        .send(
            params
        )

    await request(app)
        .delete(`/api/machines/catalog/${response.body.id}`)
        .send()

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});