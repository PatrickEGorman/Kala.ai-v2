import request from 'supertest'
import {app} from "../../../app";
import {Material} from "../../../models/Material";
import {natsWrapper} from "../../../nats-wrapper";

it('has a route handler listening to /api/materials/catalog for post requests', async () => {
    const response = await request(app)
        .post('/api/materials/catalog')
        .send({});

    expect(response.status).not.toEqual(404);
});

it('returns an error if an invalid name is provided', async () => {
    await request(app)
        .post('/api/materials/catalog')
        .send({
            name: '',
            cost: 10
        })
        .expect(400)

    await request(app)
        .post('/api/materials/catalog')
        .send({
            cost: 10
        })
        .expect(400)
});

it('returns an error if an invalid cost is provided', async () => {
    await request(app)
        .post('/api/materials/catalog')
        .send({
            name: 'sdfafsd',
            cost: -10
        })
        .expect(400)

    await request(app)
        .post('/api/materials/catalog')
        .send({
            name: "dsjfljkl"
        })
        .expect(400)
});

it('creates a ticket with valid inputs', async () => {
    let materials = await Material.find({});
    expect(materials.length).toEqual(0)

    const response = await request(app)
        .post('/api/materials/catalog')
        .send({
            name: "dsjfljkl",
            cost: 20.12
        }).expect(201)

    materials = await Material.find({});
    expect(materials.length).toEqual(1)

    expect(materials[0]._id.toString()).toEqual(response.body._id);
});


it('makes sure create event is published', async () => {
    const response = await request(app)
        .post('/api/materials/catalog')
        .send({
            name: "dsjfljkl",
            cost: 20.12
        })

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
