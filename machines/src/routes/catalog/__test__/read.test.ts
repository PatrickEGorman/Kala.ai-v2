import request from "supertest";
import {app} from "../../../app";
import mongoose from "mongoose";
import {machineParams} from "../../../test/setup";

it('returns 404 if the machine_fields is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .get(`/api/machines/catalog/${id}`)
        .send()
        .expect(404)
});

it("returns the machine_fields if the machine_fields is found", async () => {
    const params = await machineParams();

    const response = await request(app)
        .post('/api/machines/catalog')
        .send(
            params
        ).expect(201);

    const machineResponse = await request(app)
        .get(`/api/machines/catalog/${response.body.id}`)
        .send()
        .expect(200)

    expect(machineResponse.body.name).toEqual(params.name)
});