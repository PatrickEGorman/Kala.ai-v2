import express, {Request, Response} from "express";
import {NotFoundError, validateRequest} from '@kala.ai/common';
import {body} from "express-validator";
import {Factory} from "../models/factory";
import {FactoryCreatedPublisher} from "../events/publishers/factory-created-publisher";
import {natsWrapper} from "../nats-wrapper";


const router = express.Router();

router.post('/api/factories', [
    body('name')
        .not()
        .isEmpty()
        .withMessage("Name is required"),
    body("maintenanceTime")
        .isFloat({gt: 0})
        .withMessage("Maintenance Time must be greater than 0"),
    body("maintenanceCost")
        .isFloat({gt: 0})
        .withMessage("Maintenance Time must be greater than 0"),
    body("cost")
        .isFloat({gt: 0})
        .withMessage("cost must be greater than 0"),
    body("lat")
        .isFloat()
        .withMessage("Latitude must be a number"),
    body("long")
        .isFloat()
        .withMessage("Longitude must be a number"),
    body("storage")
        .isFloat({gt: 0})
        .withMessage("Storage must be a number greater than 0"),
], validateRequest, async (req: Request, res: Response) => {

    const {
        name, maintenanceTime, cost, maintenanceCost,
        operationCost, lat, long, storage
    } = req.body;

    const factory = Factory.build({
        name, maintenanceTime, cost, maintenanceCost, storage,
        location: {lat, long}
    });

    await factory.save();


    await new FactoryCreatedPublisher(natsWrapper.client).publish({
        id: factory.id,
        name: factory.name,
        maintenanceTime: factory.maintenanceTime,
        cost: factory.cost,
        maintenanceCost: factory.maintenanceCost,
        location: factory.location,
        storage: factory.storage
    })

    res.status(201).send(factory);
});

export {router as createFactoryRouter}