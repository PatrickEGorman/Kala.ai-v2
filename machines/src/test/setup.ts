import mongoose from "mongoose";
import {MongoMemoryServer} from 'mongodb-memory-server';
import {MaterialDoc, Material} from "../models/Material";
import {MachineAttrs} from "../models/Machine";

declare global {
    namespace NodeJS {
        interface Global {
            machineParams(): Promise<MachineAttrs>;

            material(): Promise<MaterialDoc>;
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

// todo: create dummy factory object for testing purposes
global.material = async () => {
    const material = Material.build({
        id: mongoose.Types.ObjectId().toHexString(),
        name: "Wood",
    });
    await material.save();
    return material
}

global.machineParams = async () => {
    const material = await global.material();

    return {
        name: "test",
        maintenanceTime: 55,
        material: material._id.toString(),
        errorRate: .05,
        initialCost: 500,
        maintenanceCost: 100,
        operationCost: 10,
        laborCost: 20
    }
}