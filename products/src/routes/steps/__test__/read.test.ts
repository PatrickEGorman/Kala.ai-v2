import request from "supertest";
import {app} from "../../../app";
import mongoose from "mongoose";
import {testStep} from "../../../test/setup";

it('returns 404 if the step_fields is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .get(`/api/products/steps/${id}`)
        .send()
        .expect(404)
});

it("returns the step_fields if the step_fields is found", async () => {
    const {material, machine, step} = await testStep();

    const stepResponse = await request(app)
        .get(`/api/products/steps/${step.id}`)
        .send()
        .expect(200)

    expect(stepResponse.body.id).toEqual(step.id.toString());
    expect(stepResponse.body.quantity).toEqual(step.quantity);
    expect(stepResponse.body.stepTime).toEqual(step.stepTime);
    expect(stepResponse.body.machine.id).toEqual(machine._id.toString());
    expect(stepResponse.body.material.id).toEqual(material._id.toString());
});