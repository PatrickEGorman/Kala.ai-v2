import express, {Request, Response} from "express";
import {NotFoundError, validateRequest} from "@kala.ai/common";
import {Factory} from "../models/Factory";
import {natsWrapper} from "../nats-wrapper";
import {FactoryUpdatedPublisher} from "../events/publishers/factory-updated-publisher";
import {body} from "express-validator";


const router = express.Router();

router.post('/api/factories/:id',
    [
        body("maintenanceTime")
            .default(0)
            .isFloat({min: 0})
            .withMessage("Maintenance Time must be positive number"),
        body("maintenanceCost")
            .default(0)
            .isFloat({min: 0})
            .withMessage("Maintenance Cost must positive number"),
        body("cost")
            .default(0)
            .isFloat({min: 0})
            .withMessage("Cost must be positive number"),
        body("storage")
            .default(0)
            .isFloat({min: 0})
            .withMessage("Storage must be positive number")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const factory = await Factory.findById(req.params.id);
        if (!factory) {
            throw new NotFoundError;
        }

        const {
            maintenanceTime, cost, maintenanceCost, storage
        } = req.body;


        maintenanceTime > 0 ? factory.set({maintenanceTime}) : {}
        maintenanceCost > 0 ? factory.set({maintenanceCost}) : {}
        cost > 0 ? factory.set({cost}) : {}
        storage > 0 ? factory.set({storage}) : {}

        factory.save();

        await new FactoryUpdatedPublisher(natsWrapper.client).publish({
            id: factory.id,
            maintenanceTime: factory.maintenanceTime,
            maintenanceCost: factory.maintenanceCost,
            cost: factory.cost,
            storage: factory.storage,
            uptime: factory.uptime
        })
        res.status(200).send(factory);
    });

export {router as updateFactoryRouter}