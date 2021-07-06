import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {testFactory} from "../../test/setup";

it('returns 404 if the Factory_fields is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .get(`/api/factories/${id}`)
        .send()
        .expect(404)
});

it("returns the Factory_fields if the factory_fields is found", async () => {
    const factory = await testFactory();

    const factoryResponse = await request(app)
        .get(`/api/factories/${factory.id}`)
        .send()
        .expect(200)

    expect(factoryResponse.body.name).toEqual(factory.name)
});