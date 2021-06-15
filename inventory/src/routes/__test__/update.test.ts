import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";

it('returns 404 if the material to update is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .post(`/api/inventory/${id}`)
        .send({cost:10, quantity:10})
        .expect(404)
});

it("updates the material quantity/cost if the material is found", async () => {
    const name = 'concert';
    let quantity = 20;
    let cost = 20;
    const factoryId = global.factoryId();

    const response = await request(app)
        .post('/api/inventory')
        .send({
            name, cost, quantity, factoryId
        })
        .expect(201);

    quantity = 10
    cost = 10

    const materialResponse = await request(app)
        .post(`/api/inventory/${response.body.id}`)
        .send({cost, quantity})
        .expect(200)

    expect(materialResponse.body.name).toEqual(name)
    expect(materialResponse.body.cost).toEqual(cost)
    expect(materialResponse.body.quantity).toEqual(quantity)
    expect(materialResponse.body.factoryId).toEqual(factoryId)
});