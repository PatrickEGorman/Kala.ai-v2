import request from 'supertest'
import {app} from "../../../app";
import {Step} from "../../../models/Step";
import {natsWrapper} from "../../../nats-wrapper";
import {testMachine, testMaterial} from "../../../test/setup";


it('returns an error if an invalid data is provided', async () => {
    await request(app)
        .post('/api/products/steps')
        .send({})
        .expect(400)
});

it('creates a step with valid machine and material + other inputs', async () => {
    let steps = await Step.find({});
    expect(steps.length).toEqual(0)

    const machine = await testMachine();
    const quantity = Math.random() * 100 + 1;
    const stepTime = Math.random() * 100 + 1;
    const name = "Test";

    const response = await request(app)
        .post('/api/products/steps')
        .send({
            name,
            machine: machine._id,
            material: machine.material._id,
            quantity,
            stepTime
        }).expect(201)

    steps = await Step.find({});
    expect(steps.length).toEqual(1)

    expect(steps[0].id.toString()).toEqual(response.body.id);
    expect(steps[0].material!._id).toEqual(machine.material._id);
    expect(steps[0].machine!._id).toEqual(machine._id);
    expect(steps[0].quantity).toEqual(quantity);
    expect(steps[0].stepTime).toEqual(stepTime);
});

it('throws an error with inconsistent machine and material inputs + other inputs', async () => {
    let steps = await Step.find({});
    expect(steps.length).toEqual(0)

    const material = await testMaterial();
    const machine = await testMachine();
    const quantity = Math.random() * 100 + 1;
    const stepTime = Math.random() * 100 + 1;
    const name = "Test";

    await request(app)
        .post('/api/products/steps')
        .send({
            name,
            machine: machine._id,
            material: material._id,
            quantity,
            stepTime
        }).expect(400)
});


it('creates a step with valid machine + other inputs', async () => {
    let steps = await Step.find({});
    expect(steps.length).toEqual(0)

    const machine = await testMachine();
    const quantity = Math.random() * 100 + 1;
    const stepTime = Math.random() * 100 + 1;
    const name = "Test";

    const response = await request(app)
        .post('/api/products/steps')
        .send({
            name,
            machine: machine._id,
            quantity,
            stepTime
        }).expect(201)

    steps = await Step.find({});
    expect(steps.length).toEqual(1)

    expect(steps[0].id.toString()).toEqual(response.body.id);
    expect(steps[0].material!._id).toEqual(machine.material._id);
    expect(steps[0].machine!._id).toEqual(machine._id);
    expect(steps[0].quantity).toEqual(quantity);
    expect(steps[0].stepTime).toEqual(stepTime);
});

it('creates a step with valid material + other inputs', async () => {
    let steps = await Step.find({});
    expect(steps.length).toEqual(0)

    const material = await testMaterial();
    const quantity = Math.random() * 100 + 1;
    const stepTime = Math.random() * 100 + 1;
    const name = "Test";

    const response = await request(app)
        .post('/api/products/steps')
        .send({
            name,
            material: material._id,
            quantity,
            stepTime
        }).expect(201)

    steps = await Step.find({});
    expect(steps.length).toEqual(1)

    expect(steps[0].id.toString()).toEqual(response.body.id);
    expect(steps[0].material!._id).toEqual(material._id);
    expect(steps[0].quantity).toEqual(quantity);
    expect(steps[0].stepTime).toEqual(stepTime);
});

it('creates a step with no machine or material but all other inputs', async () => {
    let steps = await Step.find({});
    expect(steps.length).toEqual(0)

    const quantity = 0;
    const stepTime = Math.random() * 100 + 1;
    const name = "Test";

    const response = await request(app)
        .post('/api/products/steps')
        .send({
            name,
            quantity,
            stepTime
        }).expect(201)

    steps = await Step.find({});
    expect(steps.length).toEqual(1)

    expect(steps[0].id.toString()).toEqual(response.body.id);
    expect(steps[0].material).toEqual(undefined);
    expect(steps[0].machine).toEqual(undefined);
    expect(steps[0].quantity).toEqual(quantity);
    expect(steps[0].stepTime).toEqual(stepTime);
});


it('makes sure create event is published', async () => {
    const quantity = 0;
    const stepTime = Math.random() * 100 + 1;
    const name = "Test";

    await request(app)
        .post('/api/products/steps')
        .send({
            name,
            quantity,
            stepTime
        }).expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
