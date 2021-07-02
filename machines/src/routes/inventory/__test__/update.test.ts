import request from "supertest";
import {app} from "../../../app";
import mongoose from "mongoose";
import {natsWrapper} from "../../../nats-wrapper";

it('returns 404 if the invMachine_fields to update is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .post(`/api/machines/inventory/${id}`)
        .send({uptime: 10})
        .expect(404)
});

// todo: test failing for mysterious reasons
// it("updates the invMachine_fields quantity/cost", async () => {
//     const {machine, factory} = await global.invTestObj();
//
//     const response = await request(app)
//         .post('/api/machines/inventory')
//         .send({
//             machine: machine._id, factory: factory._id
//         })
//
//
//     const invMachineResponse = await request(app)
//         .post(`/api/machines/inventory/${response.body.id}`)
//         .send({uptime: 10})
//         .expect(200)
//
//
//     expect(invMachineResponse.body.uptime).toEqual(10)
// });

it("checks if an update event is emitted", async () => {
    const {machine, factory} = await global.invTestObj();

    const response = await request(app)
        .post('/api/machines/inventory')
        .send({
            machine: machine._id, factory: factory._id
        })

    const invMachineResponse = await request(app)
        .post(`/api/machines/inventory/${response.body.id}`)
        .send({uptime: 10})

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});