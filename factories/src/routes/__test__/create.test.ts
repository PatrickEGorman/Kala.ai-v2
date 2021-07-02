import request from 'supertest'
import {app} from "../../app";
import {Factory} from "../../models/factory";
import {natsWrapper} from "../../nats-wrapper";

it('has a route handler listening to /api/factories for post requests', async () => {
    const response = await request(app)
        .post('/api/factories')
        .send({});

    expect(response.status).not.toEqual(404);
});

it('returns an error if an invalid data is provided', async () => {
    await request(app)
        .post('/api/factories')
        .send({})
        .expect(400)
});

it('creates a factory with valid inputs', async () => {
    let factories = await Factory.find({});
    expect(factories.length).toEqual(0)

    const name = "test";
    const maintenanceTime = 55;
    const cost = 500;
    const maintenanceCost = 100;
    const storage = 10;
    const lat = 20;
    const long = 20;

    const response = await request(app)
        .post('/api/factories')
        .send({
            name, maintenanceTime, cost, maintenanceCost,
            lat, long, storage
        }).expect(201)

    factories = await Factory.find({});
    expect(factories.length).toEqual(1)

    expect(factories[0].id.toString()).toEqual(response.body.id);
    expect(factories[0].maintenanceTime).toEqual(maintenanceTime);
    expect(factories[0].cost).toEqual(cost);
    expect(factories[0].storage).toEqual(storage);
    expect(factories[0].maintenanceCost).toEqual(maintenanceCost);
    expect(factories[0].location.lat).toEqual(lat);
    expect(factories[0].location.long).toEqual(long);
});


it('makes sure create event is published', async () => {

    await request(app)
        .post('/api/factories')
        .send(
            global.factoryParams
        )

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
