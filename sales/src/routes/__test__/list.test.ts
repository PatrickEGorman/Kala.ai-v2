import {app} from "../../app";
import request from "supertest";
import {testBuildable, testFactory, testProduct} from "../../test/setup";

it("Responds with an empty list if no products or factories exist", async () => {
    const productResponse = await request(app)
        .get(`/api/sales/list/`)
        .send()
        .expect(200);

    expect(productResponse.body.products).toEqual([]);
});

it("returns an empty list of if no factories can make a product", async () => {
    const product = await testProduct({});

    await testFactory({});

    const productResponse = await request(app)
        .get(`/api/sales/list/`)
        .send()
        .expect(200)

    expect(productResponse.body.products[0].product.id).toEqual(product.id);
    expect(productResponse.body.products[0].factories).toHaveLength(0);
});

it("responds with a factory if a product can be produced in one", async () => {
    const {product, factory} = await testBuildable();

    const productResponse = await request(app)
        .get(`/api/sales/list/`)
        .send()
        .expect(200)

    expect(productResponse.body.products[0].product.id).toEqual(product.id);
    expect(productResponse.body.products[0].factories[0].id).toEqual(factory.id);
});

it("responds with multiple products", async () => {
    await testBuildable();
    await testProduct({name: "test 2"});
    await testFactory({});

    const productResponse = await request(app)
        .get(`/api/sales/list/`)
        .send()
        .expect(200)

    expect(productResponse.body.products).toHaveLength(2);
});