import request from "supertest";
import {app} from "../../../app";
import mongoose from "mongoose";
import {natsWrapper} from "../../../nats-wrapper";
import {testMachine} from "../../../test/setup";

it('returns 404 if the machine_fields to update is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .post(`/api/machines/catalog/${id}`)
        .send({cost: 10, quantity: 10})
        .expect(404)
});

it("updates the machine_fields quantity/cost", async () => {
    const {machine} = await testMachine();

    const machineResponse = await request(app)
        .post(`/api/machines/catalog/${machine.id}`)
        .send({initialCost: 10})
        .expect(200)


    expect(machineResponse.body.initialCost).toEqual(10)
});

it("checks if an update event is emitted", async () => {
    const {machine} = await testMachine();

    const machineResponse = await request(app)
        .post(`/api/machines/catalog/${machine.id}`)
        .send({initialCost: 10})
        .expect(200)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});