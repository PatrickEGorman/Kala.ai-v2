import express, {Request, Response} from "express";
import {NotFoundError, validateRequest} from "@kala.ai/common";
import {Material} from "../../models/Material";
import {body} from "express-validator";
import {natsWrapper} from "../../nats-wrapper";
import {MaterialUpdatedPublisher} from "../../events/publishers/material-updated-publisher";


const router = express.Router();

router.post('/api/materials/catalog/:id',
    body("cost")
        .default(0)
        .isFloat({min: 0}),
    validateRequest,
    async (req: Request, res: Response) => {
        const material = await Material.findById(req.params.id);
        if (!material) {
            throw new NotFoundError;
        }
        if (req.body.cost > 0) {
            material.set({cost: req.body.cost});
        }

        material.save();
        await new MaterialUpdatedPublisher(natsWrapper.client).publish({
            id: material.id,
            name: material.name,
            cost: material.cost
        })
        res.status(200).send(material);
    });

export {router as updateMaterialRouter}