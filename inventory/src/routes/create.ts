import express, {Request, Response} from "express";
import {validateRequest} from '@kala.ai/common';
import {body} from "express-validator";
import {Material} from "../models/Material";


const router = express.Router();

router.post('/api/inventory', [
    body('name')
        .not()
        .isEmpty()
        .withMessage("name is required"),
    body("cost")
        .isFloat({gt: 0})
        .withMessage("cost must be greater than 0"),
    body("quantity")
        .isFloat({gt: 0})
        .withMessage("Quantity must be greater than 0"),
    body('factoryId')
        .not()
        .isEmpty()
        .withMessage("factoryId is required"),
], validateRequest, async (req: Request, res: Response) => {
    const {name, cost, quantity, factoryId} = req.body;
    // todo: verify factoryId belongs to factory
    // todo: increment quantity if it already exists
    // todo: add authorization for operator to create material
    const material = Material.build({
        name,
        cost,
        quantity,
        factoryId
    });

    await material.save();
    res.status(201).send(material);
});

export {router as createMaterialRouter}