import request from "supertest";
import {app} from "../../../app";
import mongoose from "mongoose";
import {testProduct} from "../../../test/setup";

it('returns 404 if the Product_fields is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .get(`/api/products/products/${id}`)
        .send()
        .expect(404)
});

it("returns the Product_fields if the product_fields is found", async () => {
    const product = await testProduct();

    const productResponse = await request(app)
        .get(`/api/products/products/${product.id}`)
        .send()
        .expect(200)

    expect(productResponse.body.id).toEqual(product.id)
});