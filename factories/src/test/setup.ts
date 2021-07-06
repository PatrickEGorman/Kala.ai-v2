import mongoose from "mongoose";
import {MongoMemoryServer} from 'mongodb-memory-server';
import {Factory} from "../models/Factory";
import {Material} from "../models/Material";
import {Machine} from "../models/Machine";

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

const testFactory = async () => {
    const factoryObj = Factory.build({
        name: 'test',
        maintenanceTime: 10,
        maintenanceCost: 20,
        storage: 30,
        cost: 40,
        location: {
            lat: 37.5,
            long: 77.4
        }
    })
    await factoryObj.save()
    return factoryObj;
}

const testMaterial = async () => {
    const material = Material.build({
        id: mongoose.Types.ObjectId().toHexString(),
        name: "Plastic",
    })
    await material.save();
    return material;
}

const testMachine = async () => {
    const material = await testMaterial();
    const machine = Machine.build({
        id: mongoose.Types.ObjectId().toHexString(),
        name: "3d Printer",
        material
    })
    await machine.save();
    return machine;
}

export {testMaterial, testFactory, testMachine};