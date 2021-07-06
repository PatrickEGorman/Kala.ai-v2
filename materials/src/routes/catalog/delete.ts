import express, {Request, Response} from "express";
import {Material} from "../../models/Material";
import {NotFoundError} from "@kala.ai/common";
import {MaterialDeletedPublisher} from "../../events/publishers/material-deleted-publisher";
import {natsWrapper} from "../../nats-wrapper";


const router = express.Router();

router.delete('/api/materials/catalog/:id', async (req: Request, res: Response) => {
    const material = await Material.findById(req.params.id);
    if (!material) {
        throw new NotFoundError;
    }
    await material.delete()

    // todo Do we need an event pulisher?
    // todo simplify even publisher if we need it
    await new MaterialDeletedPublisher(natsWrapper.client).publish({
        id: material.id,
        name: material.name,
        cost: material.cost
    })
    res.sendStatus(200);
});

export {router as deleteMaterialRouter};