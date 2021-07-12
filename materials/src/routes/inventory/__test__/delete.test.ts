import request from "supertest";
import {app} from "../../../app";
import mongoose from "mongoose";
import {InvMaterial} from "../../../models/InvMaterial";
import {natsWrapper} from "../../../nats-wrapper";
import {testInvMaterial} from "../../../test/setup";

it('returns 404 if the invMaterial to delete if it does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .delete(`/api/materials/inventory/${id}`)
        .send()
        .expect(404)
});


it("deletes an invMaterial", async () => {
    const {invMaterial} = await testInvMaterial();

    await request(app)
        .delete(`/api/materials/inventory/${invMaterial.id}`)
        .send()
        .expect(200)

    const invMaterials = await InvMaterial.find()
    expect(invMaterials.length).toEqual(0)
});


it("checks if a delete event is emitted", async () => {
    const {invMaterial} = await testInvMaterial();

    await request(app)
        .delete(`/api/materials/inventory/${invMaterial.id}`)
        .send()

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});