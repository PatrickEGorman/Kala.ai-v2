import request from 'supertest'
import {app} from "../../app";
import {Material} from "../../models/Material";
import mongoose from "mongoose";
import {natsWrapper} from "../../nats-wrapper";

it('has a route handler listening to /api/materials for post requests', async () => {
    const response = await request(app)
        .post('/api/materials')
        .send({});

    expect(response.status).not.toEqual(404);
});

it('returns an error if an invalid name is provided', async () => {
    await request(app)
        .post('/api/materials')
        .send({
            name: '',
            cost: 10,
            quantity: 10,
            factoryId: global.factoryId()
        })
        .expect(400)

    await request(app)
        .post('/api/materials')
        .send({
            cost: 10,
            quantity: 10,
            factoryId: global.factoryId()
        })
        .expect(400)
});

it('returns an error if an invalid cost is provided', async () => {
    await request(app)
        .post('/api/materials')
        .send({
            name: 'sdfafsd',
            cost: -10,
            quantity: 10,
            factoryId: global.factoryId()
        })
        .expect(400)

    await request(app)
        .post('/api/materials')
        .send({
            name: "dsjfljkl",
            quantity: 10,
            factoryId: global.factoryId()
        })
        .expect(400)
});

it('returns an error if an invalid quantity is provided', async () => {
    await request(app)
        .post('/api/materials')
        .send({
            name: 'sdfafsd',
            quantity: -10,
            cost: 10,
            factoryId: global.factoryId()
        })
        .expect(400)

    await request(app)
        .post('/api/materials')
        .send({
            name: "dsjfljkl",
            cost: 10,
            factoryId: global.factoryId()
        })
        .expect(400)
});

it('returns an error if an invalid quantity is provided', async () => {
    await request(app)
        .post('/api/materials')
        .send({
            name: 'sdfafsd',
            quantity: 10,
            cost: 10,
            factoryId: ""
        })
        .expect(400)

    await request(app)
        .post('/api/materials')
        .send({
            name: "dsjfljkl",
            quantity: 10,
            cost: 10
        })
        .expect(400)
});

it('creates a ticket with valid inputs', async () => {
    let materials = await Material.find({});
    expect(materials.length).toEqual(0)

    const response = await request(app)
        .post('/api/materials')
        .send({
            name: "dsjfljkl",
            cost: 20.12,
            quantity: 20.21,
            factoryId: new mongoose.Types.ObjectId().toHexString()
        }).expect(201)

    materials = await Material.find({});
    expect(materials.length).toEqual(1)

    expect(materials[0]._id.toString()).toEqual(response.body._id);
});


it('makes sure create event is published', async () => {
    const response = await request(app)
        .post('/api/materials')
        .send({
            name: "dsjfljkl",
            cost: 20.12,
            quantity: 20.21,
            factoryId: new mongoose.Types.ObjectId().toHexString()
        })

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
