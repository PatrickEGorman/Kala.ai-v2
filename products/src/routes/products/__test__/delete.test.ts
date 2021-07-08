import request from "supertest";
import {app} from "../../../app";
import mongoose from "mongoose";
import {Product} from "../../../models/Product";
import {natsWrapper} from "../../../nats-wrapper";
import {testProduct} from "../../../test/setup";

it('returns 404 if the product to delete is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .delete(`/api/products/products/${id}`)
        .expect(404)
});


it("deletes an existing product", async () => {
    const product = await testProduct();

    let products = await Product.find()
    expect(products.length).toEqual(1)

    await request(app)
        .delete(`/api/products/products/${product.id}`)
        .send()
        .expect(200)

    products = await Product.find()
    expect(products.length).toEqual(0)
});


it("checks if a delete event is emitted", async () => {
    const product = await testProduct();

    await request(app)
        .delete(`/api/products/products/${product.id}`)
        .send()

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});