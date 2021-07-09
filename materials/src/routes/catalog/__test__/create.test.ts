import request from 'supertest'
import {app} from "../../../app";
import {Material} from "../../../models/Material";
import {natsWrapper} from "../../../nats-wrapper";

it('has a route handler listening to /api/materials/catalog for post requests', async () => {
    await request(app)
        .post('/api/materials/catalog')
        .send({}).expect(400);
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
    const name = "test";
    const cost = Math.random() * 100 + 1;
    const response = await request(app)
        .post('/api/materials/catalog')
        .send({
            name,
            cost
        }).expect(201)

    const materials = await Material.find({});
    expect(materials.length).toEqual(1)

    expect(materials[0]._id.toString()).toEqual(response.body._id);
    expect(materials[0].name).toEqual(name);
    expect(materials[0].cost).toEqual(cost);
});


it('makes sure create event is published', async () => {
    await request(app)
        .post('/api/materials/catalog')
        .send({
            name: "dsjfljkl",
            cost: 20.12
        })

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
