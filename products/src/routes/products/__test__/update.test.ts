import request from "supertest";
import {app} from "../../../app";
import mongoose from "mongoose";
import {natsWrapper} from "../../../nats-wrapper";
import {testProduct} from "../../../test/setup";

it('returns 404 if the Product_fields to update is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .post(`/api/products/products/${id}`)
        .send({value: 10, quantity: 10})
        .expect(404)
});

it("updates the product field value", async () => {
    const product = await testProduct();

    const value = Math.random() * 100 + 1;

    const productResponse = await request(app)
        .post(`/api/products/products/${product.id}`)
        .send({
            value,
        })
        .expect(200)

    expect(productResponse.body.value).toEqual(value);
});

it("checks if an update event is emitted", async () => {
    const product = await testProduct();

    await request(app)
        .post(`/api/products/products/${product.id}`)
        .send({value: 10})

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});