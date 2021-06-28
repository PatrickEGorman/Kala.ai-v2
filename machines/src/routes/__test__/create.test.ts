import request from 'supertest'
import {app} from "../../app";
import {Machine} from "../../models/Machine";
import {natsWrapper} from "../../nats-wrapper";
import {Material} from "../../models/Material";
import {stringify} from "ts-jest/dist/utils/json";

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
    const materialDoc = await global.material();
    const errorRate = .05;
    const initialCost = 500;
    const maintenanceCost = 100;
    const operationCost = 10;
    const laborCost = 20;

    const material = materialDoc.id;

    const response = await request(app)
        .post('/api/machines')
        .send({
            name, maintenanceTime, material, errorRate, initialCost, maintenanceCost,
            operationCost, laborCost
        }).expect(201)

    machines = await Machine.find({});
    expect(machines.length).toEqual(1)

    console.log(machines[0].material._id)

    expect(machines[0].id.toString()).toEqual(response.body.id);
    expect(machines[0].maintenanceTime).toEqual(maintenanceTime);
    expect(machines[0].material._id.toString()).toEqual(material);
    expect(machines[0].errorRate).toEqual(errorRate);
    expect(machines[0].initialCost).toEqual(initialCost);
    expect(machines[0].maintenanceCost).toEqual(maintenanceCost);
    expect(machines[0].laborCost).toEqual(laborCost);
});


it('makes sure create event is published', async () => {
    const params = global.machineParams();

    await request(app)
        .post('/api/machines')
        .send(
            params
        )

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
