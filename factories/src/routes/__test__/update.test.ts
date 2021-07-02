import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {natsWrapper} from "../../nats-wrapper";

it('returns 404 if the Factory_fields to update is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .post(`/api/factories/${id}`)
        .send({cost: 10, quantity: 10})
        .expect(404)
});

it("updates the factory field cost", async () => {
    const response = await request(app)
        .post('/api/factories')
        .send(
            global.factoryParams
        )

    const cost = 10;
    const maintenanceTime = 20;
    const maintenanceCost = 210;
    const storage = 50;

    const factoryResponse = await request(app)
        .post(`/api/factories/${response.body.id}`)
        .send({
            cost,
            maintenanceTime,
            maintenanceCost,
            storage
        })
        .expect(200)

    expect(factoryResponse.body.cost).toEqual(cost);
    expect(factoryResponse.body.maintenanceTime).toEqual(maintenanceTime);
    expect(factoryResponse.body.maintenanceCost).toEqual(maintenanceCost);
    expect(factoryResponse.body.storage).toEqual(storage);
});

it("checks if an update event is emitted", async () => {
    const response = await request(app)
        .post('/api/factories')
        .send(
            global.factoryParams
        )

    await request(app)
        .post(`/api/factories/${response.body.id}`)
        .send({upTime: 10})

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});