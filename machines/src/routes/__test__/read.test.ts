import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";

it('returns 404 if the machine_fields is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .get(`/api/machines/${id}`)
        .send()
        .expect(404)
});

it("returns the machine_fields if the machine_fields is found", async () => {
    const response = await request(app)
        .post('/api/machines')
        .send(
            global.machineParams
        )


    const machineResponse = await request(app)
        .get(`/api/machines/${response.body.id}`)
        .send()
        .expect(200)

    expect(machineResponse.body.name).toEqual(global.machineParams.name)
});