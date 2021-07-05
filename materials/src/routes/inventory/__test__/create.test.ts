import request from 'supertest'
import {app} from "../../../app";
import {InvMaterial} from "../../../models/InvMaterial";
import {natsWrapper} from "../../../nats-wrapper";
import mongoose from "mongoose";

it('has a route handler listening to /api/materials/inventory for post requests', async () => {
    const response = await request(app)
        .post('/api/materials/inventory')
        .send({});

    expect(response.status).not.toEqual(404);
});

it('returns an error if an invalid factory is provided', async () => {
    const material = await global.material();

    await request(app)
        .post('/api/materials/inventory')
        .send({
            factory: mongoose.Types.ObjectId().toHexString(),
            material: material.id,
            quantity: Math.random() * 10
        })
        .expect(404)

    await request(app)
        .post('/api/materials/inventory')
        .send({
            factory: '',
            material: material.id,
            quantity: Math.random() * 10
        })
        .expect(400)

    await request(app)
        .post('/api/materials/inventory')
        .send({
            material: material.id,
            quantity: Math.random() * 10
        })
        .expect(400)
});

it('returns an error if an invalid material is provided', async () => {
    const factory = await global.factory();

    await request(app)
        .post('/api/materials/inventory')
        .send({
            material: mongoose.Types.ObjectId().toHexString(),
            factory: factory.id,
            quantity: Math.random() * 10
        })
        .expect(404)


    await request(app)
        .post('/api/materials/inventory')
        .send({
            material: '',
            factory: factory.id,
            quantity: Math.random() * 10
        })
        .expect(400)

    await request(app)
        .post('/api/materials/inventory')
        .send({
            factory: factory.id,
            quantity: Math.random() * 10
        })
        .expect(400)
});

it('returns an error if an invalid quantity is provided', async () => {
    const factory = await global.factory();
    const material = await global.material();

    await request(app)
        .post('/api/materials/inventory')
        .send({
            material: material.id,
            factory: factory.id,
            quantity: "test"
        })
        .expect(400)

    await request(app)
        .post('/api/materials/inventory')
        .send({
            material: material.id,
            factory: factory.id,
            quantity: 0
        })
        .expect(400)

    await request(app)
        .post('/api/materials/inventory')
        .send({
            material: material.id,
            factory: factory.id
        })
        .expect(400)
});

it('creates a ticket with valid inputs', async () => {
    const factory = await global.factory();
    const material = await global.material();

    let invMaterials = await InvMaterial.find({});
    expect(invMaterials.length).toEqual(0)

    const response = await request(app)
        .post('/api/materials/inventory')
        .send({
            factory: factory.id,
            material: material.id,
            quantity: Math.random() * 10
        }).expect(201)

    invMaterials = await InvMaterial.find({});
    expect(invMaterials.length).toEqual(1)

    expect(invMaterials[0]._id.toString()).toEqual(response.body._id);
    expect(invMaterials[0].factory._id).toEqual(factory._id);
    expect(invMaterials[0].material._id).toEqual(material._id);
});


it('makes sure create event is published', async () => {
    const factory = await global.factory();
    const material = await global.material();

    const resp = await request(app)
        .post('/api/materials/inventory')
        .send({
            factory: factory.id,
            material: material.id,
            quantity: Math.random() * 10
        })

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
