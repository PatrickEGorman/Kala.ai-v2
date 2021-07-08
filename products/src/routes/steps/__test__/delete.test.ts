import request from "supertest";
import {app} from "../../../app";
import mongoose from "mongoose";
import {Step} from "../../../models/Step";
import {natsWrapper} from "../../../nats-wrapper";
import {testStep} from "../../../test/setup";

it('returns 404 if the step to delete is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .delete(`/api/products/steps/${id}`)
        .expect(404)
});


it("deletes an existing step", async () => {
    const {step} = await testStep();

    let steps = await Step.find()
    expect(steps.length).toEqual(1)

    await request(app)
        .delete(`/api/products/steps/${step.id}`)
        .send()
        .expect(200)

    steps = await Step.find()
    expect(steps.length).toEqual(0)
});


it("checks if a delete event is emitted", async () => {
    const {step} = await testStep();

    await request(app)
        .delete(`/api/products/steps/${step.id}`)
        .send()

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});