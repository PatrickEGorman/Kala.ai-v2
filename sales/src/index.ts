import mongoose from "mongoose";
import {app} from "./app";
import {natsWrapper} from "./nats-wrapper";
import {FactoryCreatedListener} from "./events/listeners/factory/factory-created-listener";
import {FactoryDeletedListener} from "./events/listeners/factory/factory-deleted-listener";
import {InvMaterialCreatedListener} from "./events/listeners/material/inv-material-created-listener";
import {InvMaterialUpdatedListener} from "./events/listeners/material/inv-material-updated-listener";
import {InvMaterialDeletedListener} from "./events/listeners/material/inv-material-deleted-listener";
import {InvMachineCreatedListener} from "./events/listeners/machine/inv-machine-created-listener";
import {InvMachineDeletedListener} from "./events/listeners/machine/inv-machine-deleted-listener";
import {StepCreatedListener} from "./events/listeners/step/step-created-listener";
import {StepUpdatedListener} from "./events/listeners/step/step-updated-listener";
import {StepDeletedListener} from "./events/listeners/step/step-deleted-listener";
import {ProductCreatedListener} from "./events/listeners/product/product-created-listener";
import {ProductUpdatedListener} from "./events/listeners/product/product-updated-listener";
import {ProductDeletedListener} from "./events/listeners/product/product-deleted-listener";

const start = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("Sales MONGO_URI not defined")
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error("Sales NATS_CLIENT_ID not defined")
    }
    if (!process.env.NATS_URL) {
        throw new Error("Sales NATS_URL not defined")
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error("Sales NATS_CLUSTER_ID not defined")
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

        new InvMaterialCreatedListener(natsWrapper.client).listen();
        new InvMaterialUpdatedListener(natsWrapper.client).listen();
        new InvMaterialDeletedListener(natsWrapper.client).listen();

        new InvMachineCreatedListener(natsWrapper.client).listen();
        new InvMachineDeletedListener(natsWrapper.client).listen();

        new FactoryCreatedListener(natsWrapper.client).listen();
        new FactoryDeletedListener(natsWrapper.client).listen();

        new StepCreatedListener(natsWrapper.client).listen();
        new StepUpdatedListener(natsWrapper.client).listen();
        new StepDeletedListener(natsWrapper.client).listen();

        new ProductCreatedListener(natsWrapper.client).listen();
        new ProductUpdatedListener(natsWrapper.client).listen();
        new ProductDeletedListener(natsWrapper.client).listen();

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
}

start();
