import express, {Request, Response} from "express";
import {NotFoundError, validateRequest} from "@kala.ai/common";
import {Material} from "../models/Material";
import {body} from "express-validator";
import {NegativeQuantityError} from "../errors/negative-quantity-error";
import {MaterialCreatedPublisher} from "../events/material-created-publisher";
import {natsWrapper} from "../nats-wrapper";
import {MaterialUpdatedPublisher} from "../events/material-updated-publisher";


const router = express.Router();

router.post('/api/materials/:id',
    body("cost")
        .default(0)
        .isFloat({min: 0}),
    body('quantity')
        .default(0)
        .isFloat(),
    validateRequest,
    async (req: Request, res: Response) => {
        // todo: check operator authorization
        // todo: subtract cost from budget
        const material = await Material.findById(req.params.id);
        if (!material) {
            throw new NotFoundError;
        }
        if (req.body.cost > 0) {
            material.set({cost: req.body.cost});
        }

        if (req.body.quantity) {
            const quantity = material.quantity + req.body.quantity
            if (quantity >= 0) {
                material.set({quantity: quantity});
                await material.save();
            } else {
                throw new NegativeQuantityError();
            }
        }
        material.save();
        await new MaterialUpdatedPublisher(natsWrapper.client).publish({
            id: material.id,
            name: material.name,
            cost: material.cost,
            quantity: material.quantity,
            factoryId: material.factoryId
        })
        res.status(200).send(material);
    });

export {router as updateMaterialRouter}