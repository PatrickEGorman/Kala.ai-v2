import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {Factory} from "../../models/Factory";
import {natsWrapper} from "../../nats-wrapper";
import {testFactory} from "../../test/setup";

it('returns 404 if the factory to delete is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .delete(`/api/factories/${id}`)
        .expect(404)
});


it("deletes an existing factory", async () => {
    const factory = await testFactory();

    let factories = await Factory.find()
    expect(factories.length).toEqual(1)

    await request(app)
        .delete(`/api/factories/${factory.id}`)
        .send()
        .expect(200)

    factories = await Factory.find()
    expect(factories.length).toEqual(0)
});


it("checks if a delete event is emitted", async () => {
    const factory = await testFactory();

    await request(app)
        .delete(`/api/factories/${factory.id}`)
        .send()

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});