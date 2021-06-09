import request from 'supertest'
import {app} from "../../app";
import {Material} from "../../models/Material";

it('has a route handler listening to /api/inventory for post requests', async () => {
    const response = await request(app)
        .post('/api/inventory')
        .send({});

    expect(response.status).not.toEqual(404);
});

it('returns an error if an invalid name is provided', async () => {
    await request(app)
        .post('/api/inventory')
        .send({
            name: '',
            cost: 10,
            quantity: 10
        })
        .expect(400)

    await request(app)
        .post('/api/inventory')
        .send({
            cost: 10,
            quantity: 10
        })
        .expect(400)
});

it('returns an error if an invalid cost is provided', async () => {
    await request(app)
        .post('/api/inventory')
        .send({
            name: 'sdfafsd',
            cost: -10,
            quantity: 10
        })
        .expect(400)

    await request(app)
        .post('/api/inventory')
        .send({
            name: "dsjfljkl",
            quantity: 10
        })
        .expect(400)
});

it('returns an error if an invalid quantity is provided', async () => {
    await request(app)
        .post('/api/inventory')
        .send({
            name: 'sdfafsd',
            quantity: -10,
            cost: 10
        })
        .expect(400)

    await request(app)
        .post('/api/inventory')
        .send({
            name: "dsjfljkl",
            cost: 10
        })
        .expect(400)
});

it('creates a ticket with valid inputs', async () => {
    let inventory = await Material.find({});
    expect(inventory.length).toEqual(0)

    const response = await request(app)
        .post('/api/inventory')
        .send({
            name: "dsjfljkl",
            cost: 20.12,
            quantity: 20.21
        }).expect(201)

    inventory = await Material.find({});
    expect(inventory.length).toEqual(1)

    expect(inventory[0]._id.toString()).toEqual(response.body._id);
});
