import request from "supertest";
import {app} from "../../../app";
import mongoose from "mongoose";
import {Material} from "../../../models/Material";
import {natsWrapper} from "../../../nats-wrapper";
import {testMaterial} from "../../../test/setup";

it('returns 404 if the material to delete is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .delete(`/api/materials/catalog/${id}`)
        .send()
        .expect(404)
});


it("deletes a material if it is found", async () => {
    const material = await testMaterial();

    let materials = await Material.find();
    expect(materials.length).toEqual(1);

    await request(app)
        .delete(`/api/materials/catalog/${material.id}`)
        .send()
        .expect(200)

    materials = await Material.find()
    expect(materials.length).toEqual(0)
});


it("checks if a delete event is emitted", async () => {
    const material = await testMaterial();
    await request(app)
        .delete(`/api/materials/catalog/${material.id}`)
        .send()

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});