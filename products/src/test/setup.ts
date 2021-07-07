import mongoose from "mongoose";
import {MongoMemoryServer} from 'mongodb-memory-server';
import {Material} from "../../../factories/src/models/Material";
import {Machine} from "../../../factories/src/models/Machine";

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
