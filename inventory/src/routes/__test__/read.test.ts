import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";

it('returns 404 if the material_fields is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .get(`/api/inventory/${id}`)
        .send()
        .expect(404)
});

it("returns the material_fields if the material_fields is found", async () => {
    const name = 'concert';
    const quantity = 20;
    const cost = 20;
    const factoryId = global.factoryId();

    const response = await request(app)
        .post('/api/inventory')
        .send({
            name, cost, quantity, factoryId
        })
        .expect(201);

    const materialResponse = await request(app)
        .get(`/api/inventory/${response.body.id}`)
        .send()
        .expect(200)

    expect(materialResponse.body.name).toEqual(name)
    expect(materialResponse.body.cost).toEqual(cost)
    expect(materialResponse.body.quantity).toEqual(quantity)
    expect(materialResponse.body.factoryId).toEqual(factoryId)
});