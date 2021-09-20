import mongoose from 'mongoose';
import {app} from "../../app";
import request from "supertest";
import {testBuildable, testFactory, testProduct} from "../../test/setup";

it("Returns a 404 if product to read not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .get(`/api/sales/read/${id}`)
        .send()
        .expect(404)
});

it("returns an empty list if no factories can make product", async () => {
    const product = await testProduct({});

    await testFactory({});

    const productResponse = await request(app)
        .get(`/api/sales/read/${product.id}`)
        .send()
        .expect(200)

    expect(productResponse.body.product.id).toEqual(product.id);
    expect(productResponse.body.factories.length).toEqual(0);
});

it("responds with a factory if the product can be produced in one", async () => {
    const {product, factory} = await testBuildable();

    const productResponse = await request(app)
        .get(`/api/sales/read/${product.id}`)
        .send()
        .expect(200)

    expect(productResponse.body.product.id).toEqual(product.id);
    expect(productResponse.body.factories[0].id).toEqual(factory.id);
})
;