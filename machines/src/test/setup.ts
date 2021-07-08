import mongoose from "mongoose";
import {MongoMemoryServer} from 'mongodb-memory-server';
import {Material, MaterialDoc} from "../models/Material";
import {Machine, MachineAttrs, MachineDoc} from "../models/Machine";
import {Factory, FactoryDoc} from "../models/Factory";

interface invTest {
    machine: MachineDoc;
    material: MaterialDoc;
    factory: FactoryDoc;
}

declare global {
    namespace NodeJS {
        interface Global {
            machineParams(): Promise<MachineAttrs>;

            material(): Promise<MaterialDoc>;

            invTestObj(): Promise<invTest>
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

const testMaterial = async () => {
    const material = Material.build({
        id: mongoose.Types.ObjectId().toHexString(),
        name: "Wood",
    });
    await material.save();
    return material
}

const machineParams = async () => {
    const material = await testMaterial();

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

const invTestObj = async () => {
    const material = await testMaterial();
    const machine = Machine.build({
        name: "test",
        maintenanceTime: 55,
        material: material,
        errorRate: .05,
        initialCost: 500,
        maintenanceCost: 100,
        operationCost: 10,
        laborCost: 20
    });
    await machine.save();
    const factory = Factory.build({
        id: mongoose.Types.ObjectId().toHexString(),
        name: "testFactory",
        location: {lat: 25, long: 47}
    });
    await factory.save();
    return {material, machine, factory}
}

export {testMaterial, machineParams, invTestObj}
