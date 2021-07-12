import request from "supertest";
import {app} from "../../../app";
import mongoose from "mongoose";
import {testInvMaterial} from "../../../test/setup";

it('returns 404 if the invMaterial to read is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .get(`/api/materials/inventory/${id}`)
        .send()
        .expect(404)
});

it("returns the invMaterial fields if the invMaterial is found", async () => {
    const {invMaterial, material, factory} = await testInvMaterial();

    const invMaterialResponse = await request(app)
        .get(`/api/materials/inventory/${invMaterial.id}`)
        .send()
        .expect(200)

    expect(invMaterialResponse.body.quantity).toEqual(invMaterial.quantity)
    expect(invMaterialResponse.body.material.id).toEqual(material.id.toString())
    expect(invMaterialResponse.body.factory.id).toEqual(factory.id.toString())
});