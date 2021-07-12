import request from 'supertest'
import {app} from "../../../app";
import {Product} from "../../../models/Product";
import {natsWrapper} from "../../../nats-wrapper";
import {testStep} from "../../../test/setup";

it('has a route handler listening to /api/products/products for post requests', async () => {
    const response = await request(app)
        .post('/api/products/products')
        .send({});

    expect(response.status).not.toEqual(404);
});

it('returns an error if an invalid data is provided', async () => {
    await request(app)
        .post('/api/products/products')
        .send({})
        .expect(400)
});

it('creates a product with valid inputs', async () => {
    const name = "test";
    const SKU = "testing";
    const value = 500;

    const stepOne = (await testStep()).step;
    const stepTwo = (await testStep("test2")).step;

    const response = await request(app)
        .post('/api/products/products')
        .send({
            name, SKU, value, steps: [stepOne.id, stepTwo.id]
        }).expect(201)

    const products = await Product.find({});
    expect(products.length).toEqual(1)

    expect(products[0].id.toString()).toEqual(response.body.id);
    expect(products[0].SKU).toEqual(SKU);
    expect(products[0].value).toEqual(value);
    expect(products[0].steps[0]._id.toString()).toEqual(stepOne.id);
    expect(products[0].steps[1]._id.toString()).toEqual(stepTwo.id);
});


it('makes sure create product event is published', async () => {

    const name = "test";
    const SKU = "testing";
    const value = 500;

    const stepOne = (await testStep()).step;
    const stepTwo = (await testStep("testTwo")).step;

    await request(app)
        .post('/api/products/products')
        .send({
            name, SKU, value, steps: [stepOne.id, stepTwo.id]
        }).expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
