import mongoose from "mongoose";
import {MongoMemoryServer} from 'mongodb-memory-server';
import {Factory} from "../models/Factory";
import {Material} from "../models/Material";
import {InvMaterial} from "../models/InvMaterial";

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

const testFactory = async () => {
    const factory = Factory.build({
        id: mongoose.Types.ObjectId().toHexString(),
        name: "Riverside",
        location: {lat: 25, long: 45}
    })
    await factory.save()
    return factory;
}

const testMaterial = async () => {
    const material = Material.build({
        name: "Plastic",
        cost: 20
    })
    await material.save()
    return material;
}

const testInvMaterial = async () => {
    const material = await testMaterial();
    const factory = await testFactory();
    let quantity = Math.random() * 10;

    const invMaterial = await InvMaterial.buildAndSave({
        material,
        factory,
        quantity
    })

    return {material, factory, invMaterial}
}

export {testMaterial, testFactory, testInvMaterial};