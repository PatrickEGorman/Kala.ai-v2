import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {natsWrapper} from "../../nats-wrapper";

it('returns 404 if the machine_fields to update is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .post(`/api/machines/${id}`)
        .send({cost: 10, quantity: 10})
        .expect(404)
});

it("updates the machine_fields quantity/cost", async () => {
    const params = await global.machineParams();

    const response = await request(app)
        .post('/api/machines')
        .send(
            params
        )


    const machineResponse = await request(app)
        .post(`/api/machines/${response.body.id}`)
        .send({uptime: 10})
        .expect(200)


    expect(machineResponse.body.uptime).toEqual(10)
});

it("checks if an update event is emitted", async () => {
    const params = await global.machineParams();

    const response = await request(app)
        .post('/api/machines')
        .send(
            params
        )

    const machineResponse = await request(app)
        .post(`/api/machines/${response.body.id}`)
        .send({upTime: 10})

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});