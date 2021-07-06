import express, {Request, Response} from "express";
import {Factory} from "../models/Factory";
import {NotFoundError} from "@kala.ai/common";
import {FactoryDeletedPublisher} from "../events/publishers/factory-deleted-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();

router.delete('/api/factories/:id', async (req: Request, res: Response) => {
    const factory = await Factory.findById(req.params.id);
    if (!factory) {
        throw new NotFoundError;
    }
    await factory.delete()

    await new FactoryDeletedPublisher(natsWrapper.client).publish({
        id: factory.id,
        cost: factory.cost
    })
    res.sendStatus(200);
});

export {router as deleteFactoryRouter};