import mongoose from "mongoose";
import {MongoMemoryServer} from 'mongodb-memory-server';
import {Material} from "../models/Material";
import {Machine} from "../models/Machine";
import {Step} from "../models/Step";

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

const testStep = async () => {
    const machine = await testMachine();
    const material = machine.populate("material").material;

    const name = "testStep"
    const quantity = Math.random() * 100;
    const stepTime = Math.random() * 100;

    const step = await Step.build({
        name,
        machine,
        material,
        quantity,
        stepTime
    })

    await step.save();

    return {step, machine, material}
}

export {testMaterial, testMachine, testStep}