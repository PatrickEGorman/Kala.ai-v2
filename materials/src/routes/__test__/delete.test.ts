import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {Material} from "../../models/Material";
import {natsWrapper} from "../../nats-wrapper";

it('returns 404 if the material_fields to delete is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .delete(`/api/materials/${id}`)
        .send({cost: 10, quantity: 10})
        .expect(404)
});


it("updates the material_fields quantity/cost if the material_fields is found and final quantity is positive", async () => {
    const name = 'concert';
    let cost = 20;

    const response = await request(app)
        .post('/api/materials')
        .send({
            name, cost
        })

    await request(app)
        .delete(`/api/materials/${response.body.id}`)
        .send()
        .expect(200)

    const materials = await Material.find()
    expect(materials.length).toEqual(0)
});


it("checks if a delete event is emitted", async () => {
    const name = 'concert';
    let cost = 20;

    const response = await request(app)
        .post('/api/materials')
        .send({
            name, cost
        })

    await request(app)
        .delete(`/api/materials/${response.body.id}`)
        .send()

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});