import request from 'supertest'
import {app} from "../../app";
import {Machine} from "../../models/Machine";
import {natsWrapper} from "../../nats-wrapper";

it('has a route handler listening to /api/machines for post requests', async () => {
    const response = await request(app)
        .post('/api/machines')
        .send({});

    expect(response.status).not.toEqual(404);
});

it('returns an error if an invalid data is provided', async () => {
    await request(app)
        .post('/api/machines')
        .send({})
        .expect(400)
});

it('creates a machine with valid inputs', async () => {
    let machines = await Machine.find({});
    expect(machines.length).toEqual(0)

    const name = "test";
    const maintenanceTime = 55;
    const factoryId = global.factoryId();
    const material = "wood";
    const errorRate = .05;
    const initialCost = 500;
    const maintenanceCost = 100;
    const operationCost = 10;
    const laborCost = 20;

    const response = await request(app)
        .post('/api/machines')
        .send({
            name, factoryId, maintenanceTime, material, errorRate, initialCost, maintenanceCost,
            operationCost, laborCost
        }).expect(201)

    machines = await Machine.find({});
    expect(machines.length).toEqual(1)

    expect(machines[0].id.toString()).toEqual(response.body.id);
    expect(machines[0].maintenanceTime).toEqual(maintenanceTime);
    expect(machines[0].factoryId.toString()).toEqual(factoryId);
    expect(machines[0].material).toEqual(material);
    expect(machines[0].errorRate).toEqual(errorRate);
    expect(machines[0].initialCost).toEqual(initialCost);
    expect(machines[0].maintenanceCost).toEqual(maintenanceCost);
    expect(machines[0].laborCost).toEqual(laborCost);
});


it('makes sure create event is published', async () => {
    const response = await request(app)
        .post('/api/machines')
        .send(
            global.machineParams
        )

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
