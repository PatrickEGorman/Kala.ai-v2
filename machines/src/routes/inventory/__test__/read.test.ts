import request from "supertest";
import {app} from "../../../app";
import mongoose from "mongoose";
import {testInvMachine} from "../../../test/setup";

it('returns 404 if the invMachine_fields is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .get(`/api/machines/inventory/${id}`)
        .send()
        .expect(404)
});

it("returns the invMachine if the invMachine_fields is found", async () => {
    const {invMachine, machine, material, factory} = await testInvMachine();

    const invMachineResponse = await request(app)
        .get(`/api/machines/inventory/${invMachine.id}`)
        .send()
        .expect(200)

    expect(invMachineResponse.body.machine.id).toEqual(machine._id.toString())
    expect(invMachineResponse.body.material.id).toEqual(material._id.toString())
    expect(invMachineResponse.body.factory.id).toEqual(factory._id.toString())
});