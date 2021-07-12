import request from "supertest";
import {app} from "../../../app";
import mongoose from "mongoose";
import {natsWrapper} from "../../../nats-wrapper";
import {Material} from "../../../models/Material";
import {testMaterial} from "../../../test/setup";

it('returns 404 if the material to update is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .post(`/api/materials/catalog/${id}`)
        .send({cost: 10})
        .expect(404)
});

it("updates the material cost", async () => {
    const material = await testMaterial();

    const cost = Math.random() * 100 + 1;

    const materialResponse = await request(app)
        .post(`/api/materials/catalog/${material.id}`)
        .send({cost})
        .expect(200)

    expect(materialResponse.body.id).toEqual(material.id.toString());
    expect(materialResponse.body.cost).toEqual(cost);

    const materials = await Material.find({});
    expect(materials.length).toEqual(1)

    expect(materials[0]._id.toString()).toEqual(materialResponse.body._id);
    expect(materials[0].name).toEqual(materialResponse.body.name);
    expect(materials[0].cost).toEqual(cost);
});

it("checks if an update event is emitted", async () => {
    const material = await testMaterial();

    const cost = Math.random() * 100 + 1;

    await request(app)
        .post(`/api/materials/catalog/${material.id}`)
        .send({cost})

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});