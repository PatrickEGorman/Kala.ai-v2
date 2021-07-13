import mongoose from "mongoose";
import {app} from "./app";
import {natsWrapper} from "./nats-wrapper";
import {MaterialCreatedListener} from "./events/listeners/material/material-created-listener";
import {MachineCreatedListener} from "./events/listeners/machine/machine-created-listener";
import {InvMaterialCreatedListener} from "./events/listeners/material/inv-material-created-listener";
import {InvMachineCreatedListener} from "./events/listeners/machine/inv-machine-created-listener";
import {InvMaterialUpdatedListener} from "./events/listeners/material/inv-material-updated-listener";
import {InvMaterialDeletedListener} from "./events/listeners/material/inv-material-deleted-listener";
import {InvMachineDeletedListener} from "./events/listeners/machine/inv-machine-deleted-listener";

const start = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("Factories MONGO_URI not defined")
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error("Factories NATS_CLIENT_ID not defined")
    }
    if (!process.env.NATS_URL) {
        throw new Error("Factories NATS_URL not defined")
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error("Factories NATS_CLUSTER_ID not defined")
    }
    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        )
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new MaterialCreatedListener(natsWrapper.client).listen();
        new MachineCreatedListener(natsWrapper.client).listen();

        new InvMaterialCreatedListener(natsWrapper.client).listen();
        new InvMaterialUpdatedListener(natsWrapper.client).listen();
        new InvMaterialDeletedListener(natsWrapper.client).listen();

        new InvMachineCreatedListener(natsWrapper.client).listen();
        new InvMachineDeletedListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Connected to MongoDb');
    } catch (err) {
        console.error(err);
    }
    app.listen(3000, () => {
        console.log("Listening on port 3000");
    })
};

start();

