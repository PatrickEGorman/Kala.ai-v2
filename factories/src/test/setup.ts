import mongoose from "mongoose";
import {MongoMemoryServer} from 'mongodb-memory-server';
import {FactoryAttrs} from "../models/factory";

declare global {
    namespace NodeJS {
        interface Global {
            factoryParams: any;
        }
    }
}

let mongo: any;
jest.mock('../nats-wrapper');

beforeAll(async () => {
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

global.factoryParams = {
    name: 'test',
    maintenanceTime: 10,
    maintenanceCost: 20,
    storage: 30,
    cost: 40,
    lat: 37.5,
    long: 77.4
}
