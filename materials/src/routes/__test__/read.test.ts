import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";

it('returns 404 if the material_fields is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .get(`/api/materials/${id}`)
        .send()
        .expect(404)
});

it("returns the material_fields if the material_fields is found", async () => {
    const name = 'concert';
    const cost = 20;

    const response = await request(app)
        .post('/api/materials')
        .send({
            name, cost
        })
        .expect(201);

    const materialResponse = await request(app)
        .get(`/api/materials/${response.body.id}`)
        .send()
        .expect(200)

    expect(materialResponse.body.name).toEqual(name)
    expect(materialResponse.body.cost).toEqual(cost)
});