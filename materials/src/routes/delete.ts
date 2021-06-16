import express, {Request, Response} from "express";
import {Material} from "../models/Material";
import {NotFoundError} from "@kala.ai/common";


const router = express.Router();

router.delete('/api/materials/:id', async (req: Request, res: Response) => {
    const material = await Material.findById(req.params.id);
    if (!material) {
        throw new NotFoundError;
    }
    await material.delete()
    res.sendStatus(200);
});

export {router as deleteMaterialRouter};