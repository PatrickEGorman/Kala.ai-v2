import mongoose from "mongoose";
import {MongoMemoryServer} from 'mongodb-memory-server';
import {Factory, FactoryDoc} from "../models/Factory";
import {Material, MaterialDoc} from "../models/Material";
import {InvMaterial, InvMaterialDoc} from "../models/InvMaterial";

declare global {
    namespace NodeJS {
        interface Global {
            factory(): Promise<FactoryDoc>,

            material(): Promise<MaterialDoc>,

            invMaterial(): Promise<{ invMaterial: InvMaterialDoc, factory: FactoryDoc, material: MaterialDoc }>
        }
    }
}

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

global.factory = async () => {
    const factory = Factory.build({
        id: mongoose.Types.ObjectId().toHexString(),
        name: "Riverside",
        location: {lat: 25, long: 45}
    })
    await factory.save()
    return factory;
}

global.material = async () => {
    const material = Material.build({
        name: "Plastic",
        cost: 20
    })
    await material.save()
    return material;
}

global.invMaterial = async () => {
    const material = await global.material();
    const factory = await global.factory();
    let quantity = Math.random() * 10;

    const invMaterial = InvMaterial.build({
        material,
        factory,
        quantity
    })

    await invMaterial.save();
    return {material, factory, invMaterial}
}