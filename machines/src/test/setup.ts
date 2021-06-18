import mongoose from "mongoose";
import {MongoMemoryServer} from 'mongodb-memory-server';
import {MachineFieldAttrs} from "@kala.ai/common";

declare global {
    namespace NodeJS {
        interface Global {
            machineParams: MachineFieldAttrs

            factoryId(): string,
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
global.factoryId = () => {
    return new mongoose.Types.ObjectId().toHexString()
}

global.machineParams = {
    name: "test",
    maintenanceTime: 55,
    uptime: 0,
    factoryId: global.factoryId(),
    material: "wood",
    errorRate: .05,
    initialCost: 500,
    maintenanceCost: 100,
    operationCost: 10,
    laborCost: 20
}