import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {Factory} from "../../models/factory";
import {natsWrapper} from "../../nats-wrapper";

it('returns 404 if the factory to delete is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .delete(`/api/factories/${id}`)
        .expect(404)
});


it("deletes an existing factory", async () => {
    const response = await request(app)
        .post('/api/factories')
        .send(
            global.factoryParams
        )

    await request(app)
        .delete(`/api/factories/${response.body.id}`)
        .send()
        .expect(200)

    const factories = await Factory.find()
    expect(factories.length).toEqual(0)
});


it("checks if a delete event is emitted", async () => {
    const response = await request(app)
        .post('/api/factories')
        .send(
            global.factoryParams
        )

    await request(app)
        .delete(`/api/factories/${response.body.id}`)
        .send()

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});