import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";

it('returns 404 if the material_fields to update is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .post(`/api/inventory/${id}`)
        .send({cost: 10, quantity: 10})
        .expect(404)
});

it("returns a 400 if final quantity after change would be a negative number",
    async () => {
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
        cost = 10;
        const materialResponse = await request(app)
            .post(`/api/inventory/${response.body.id}`)
            .send({cost, quantity: -30})
            .expect(400)
    });

it("updates the material_fields quantity/cost if the material_fields is found and final quantity is positive", async () => {
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

    cost = 10;

    const materialResponse = await request(app)
        .post(`/api/inventory/${response.body.id}`)
        .send({cost, quantity: -10})
        .expect(200)


    expect(materialResponse.body.name).toEqual(name)
    expect(materialResponse.body.cost).toEqual(cost)
    expect(materialResponse.body.quantity).toEqual(10)
    expect(materialResponse.body.factoryId).toEqual(factoryId)
});