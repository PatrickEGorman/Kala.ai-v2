import express, {Request, Response} from "express";
import {validateRequest} from '@kala.ai/common';
import {body} from "express-validator";
import {Material} from "../models/Material";
import {MaterialCreatedPublisher} from "../events/publishers/material-created-publisher";
import {natsWrapper} from "../nats-wrapper";


const router = express.Router();

router.post('/api/materials', [
    body('name')
        .not()
        .isEmpty()
        .withMessage("name is required"),
    body("cost")
        .isFloat({gt: 0})
        .withMessage("cost must be greater than 0"),
], validateRequest, async (req: Request, res: Response) => {
    const {name, cost} = req.body;
    // todo: verify factoryId belongs to factory
    // todo: increment quantity if it already exists
    // todo: add authorization for operator to create material_fields
    // todo: subtract cost from budget
    const material = Material.build({
        name,
        cost
    });

    await material.save();

    await new MaterialCreatedPublisher(natsWrapper.client).publish({
        id: material.id,
        name: material.name,
        cost: material.cost
    })

    res.status(201).send(material);
});

export {router as createMaterialRouter}