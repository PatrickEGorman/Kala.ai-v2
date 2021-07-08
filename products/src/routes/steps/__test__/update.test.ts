import request from "supertest";
import {app} from "../../../app";
import mongoose from "mongoose";
import {natsWrapper} from "../../../nats-wrapper";
import {testStep} from "../../../test/setup";
import {Step} from "../../../models/Step";

it('returns 404 if the step_fields to update is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .post(`/api/products/steps/${id}`)
        .send({uptime: 10})
        .expect(404)
});

it("updates the step fields quantity/stepTime", async () => {
    let {step} = await testStep();

    const quantity = Math.random() * 100;
    const stepTime = Math.random() * 100;

    const stepResponse = await request(app)
        .post(`/api/products/steps/${step.id}`)
        .send({quantity, stepTime})
        .expect(200)

    expect(stepResponse.body.quantity).toEqual(quantity);
    expect(stepResponse.body.stepTime).toEqual(stepTime);

    // @ts-ignore
    step = await Step.findById(step.id);
    expect(step.quantity).toEqual(quantity);
    expect(step.stepTime).toEqual(stepTime);
});

it("checks if a step update event is emitted", async () => {
    const {step} = await testStep();

    const quantity = Math.random() * 100;
    const stepTime = Math.random() * 100;

    await request(app)
        .post(`/api/products/steps/${step.id}`)
        .send({quantity, stepTime})

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});