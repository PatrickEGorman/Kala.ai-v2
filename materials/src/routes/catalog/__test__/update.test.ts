import request from "supertest";
import {app} from "../../../app";
import mongoose from "mongoose";
import {natsWrapper} from "../../../nats-wrapper";

it('returns 404 if the material to update is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .post(`/api/materials/catalog/${id}`)
        .send({cost: 10})
        .expect(404)
});

it("updates the material cost", async () => {
    const name = 'concert';
    let cost = 20;

    const response = await request(app)
        .post('/api/materials/catalog')
        .send({
            name, cost
        })
        .expect(201);

    cost = 10;

    const materialResponse = await request(app)
        .post(`/api/materials/catalog/${response.body.id}`)
        .send({cost})
        .expect(200)


    expect(materialResponse.body.name).toEqual(name)
    expect(materialResponse.body.cost).toEqual(cost)
});

it("checks if an update event is emitted", async () => {
    const name = 'concert';
    let cost = 20;

    const response = await request(app)
        .post('/api/materials/catalog')
        .send({
            name, cost
        })

    const materialResponse = await request(app)
        .post(`/api/materials/catalog/${response.body.id}`)
        .send({cost: 10})

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});