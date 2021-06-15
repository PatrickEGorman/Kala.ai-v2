import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {Material} from "../../models/Material";

it('returns 404 if the material to delete is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .delete(`/api/inventory/${id}`)
        .send({cost:10, quantity:10})
        .expect(404)
});


it("updates the material quantity/cost if the material is found and final quantity is positive", async () => {
    const name = 'concert';
    let quantity = 20;
    let cost = 20;
    const factoryId = global.factoryId();

    const response = await request(app)
        .post('/api/inventory')
        .send({
            name, cost, quantity, factoryId
        })

    await request(app)
        .delete(`/api/inventory/${response.body.id}`)
        .send()
        .expect(200)

    const materials = await Material.find()
    expect(materials.length).toEqual(0)
});