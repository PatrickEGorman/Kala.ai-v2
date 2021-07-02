import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";

it('returns 404 if the Factory_fields is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .get(`/api/factories/${id}`)
        .send()
        .expect(404)
});

it("returns the Factory_fields if the factory_fields is found", async () => {
    const response = await request(app)
        .post('/api/factories')
        .send(
            global.factoryParams
        ).expect(201);

    const factoryResponse = await request(app)
        .get(`/api/factories/${response.body.id}`)
        .send()
        .expect(200)

    expect(factoryResponse.body.name).toEqual(global.factoryParams.name)
});