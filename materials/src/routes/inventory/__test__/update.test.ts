import request from "supertest";
import {app} from "../../../app";
import mongoose from "mongoose";
import {natsWrapper} from "../../../nats-wrapper";
import {testInvMaterial} from "../../../test/setup";

it('returns 404 if the invMaterial to update is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .post(`/api/materials/inventory/${id}`)
        .send({quantity: 10})
        .expect(404)
});

it("updates the invMaterial quantity", async () => {
    const {invMaterial, factory, material} = await testInvMaterial();

    const quantity = Math.random() * 10;

    const invMaterialResponse = await request(app)
        .post(`/api/materials/inventory/${invMaterial.id}`)
        .send({quantity})
        .expect(200)


    expect(invMaterialResponse.body.quantity).toEqual(invMaterial.quantity + quantity);
    expect(invMaterialResponse.body.factory).toEqual(factory.id);
    expect(invMaterialResponse.body.material).toEqual(material.id);
});

// todo Add factory transfer test

it("checks if an update event is emitted", async () => {
    const {invMaterial, factory, material} = await testInvMaterial();

    const quantity = Math.random() * 10;

    const invMaterialResponse = await request(app)
        .post(`/api/materials/inventory/${invMaterial.id}`)
        .send({quantity})

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});