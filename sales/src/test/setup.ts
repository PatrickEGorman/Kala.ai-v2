import mongoose from "mongoose";
import {MongoMemoryServer} from 'mongodb-memory-server';
import {Step, StepDoc} from "../models/Step";
import {Product} from "../models/Product";
import {Factory, FactoryDoc} from "../models/Factory";
import {InvMaterial} from "../models/InvMaterial";
import {InvMachine} from "../models/InvMachine";

let mongo: any;
jest.mock('../nats-wrapper');

beforeAll(async () => {
    jest.clearAllMocks();

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
})

const testFactory = async (args: { location?: { lat: number, long: number }, name?: string }) => {
    let {location, name} = args;
    if (!location) {
        location = {lat: 25, long: 45}
    }
    if (!name) {
        name = "test factory";
    }
    const factory = Factory.build({
        id: mongoose.Types.ObjectId().toHexString(),
        name,
        location
    });
    await factory.save();
    return factory;
}

const testInvMaterial = async (args: { material?: string, factory?: FactoryDoc, quantity?: number }) => {
    let {material, factory, quantity} = args;
    if (!material) {
        material = mongoose.Types.ObjectId().toHexString();
    }
    if (!factory) {
        factory = await testFactory({})
    }
    if (!quantity) {
        quantity = Math.random() * 100;
    }
    return InvMaterial.buildAndSave({
        _id: mongoose.Types.ObjectId().toHexString(),
        material,
        factory,
        quantity
    });
}

const testInvMachine = async (args: { machine?: string, factory?: FactoryDoc }) => {
    let {machine, factory} = args;
    if (!machine) {
        machine = mongoose.Types.ObjectId().toHexString();
    }
    if (!factory) {
        factory = await testFactory({})
    }
    return InvMachine.buildAndSave({
        _id: mongoose.Types.ObjectId().toHexString(),
        machine,
        factory
    });
}

const testStep = async (args: { machine?: string, material?: string, quantity?: number }) => {
    let {machine, material, quantity} = args;
    if (!machine) {
        machine = mongoose.Types.ObjectId().toHexString();
    }
    if (!material) {
        material = mongoose.Types.ObjectId().toHexString();
    }
    if (!quantity) {
        quantity = Math.random() * 100;
    }
    const stepTime = Math.random() * 100;

    const step = await Step.build({
        _id: mongoose.Types.ObjectId().toHexString(),
        machine,
        material,
        quantity,
        stepTime
    })

    await step.save();

    return step;
}

const testProduct = async (args: { name?: string, steps?: StepDoc[] }) => {
    let {name, steps} = args;
    if (!steps) {
        const step = await testStep({});
        steps = [step];
    }
    if (!name) {
        name = "testProduct";
    }
    const product = await Product.build({
        _id: mongoose.Types.ObjectId().toHexString(), name, steps, value: Math.random() * 100 + 1
    })
    await product.save();

    return product;
}

export {testFactory, testInvMaterial, testInvMachine, testStep, testProduct}