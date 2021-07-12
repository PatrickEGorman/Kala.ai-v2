import request from "supertest";
import {app} from "../../../app";
import mongoose from "mongoose";
import {testMaterial} from "../../../test/setup";

it('returns 404 if the material_fields is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .get(`/api/materials/catalog/${id}`)
        .send()
        .expect(404)
});

it("returns the material fields if the material is found", async () => {
    const material = await testMaterial();

    const materialResponse = await request(app)
        .get(`/api/materials/catalog/${material.id}`)
        .send()
        .expect(200)

    expect(materialResponse.body.id).toEqual(material.id)
    expect(materialResponse.body.name).toEqual(material.name)
    expect(materialResponse.body.cost).toEqual(material.cost)
});