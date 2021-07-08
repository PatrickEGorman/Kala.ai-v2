import express, {Request, Response} from "express";
import {Step} from "../../models/Step";
import {NotFoundError} from "@kala.ai/common";


const router = express.Router();

router.get('/api/products/steps/:id', async (req: Request, res: Response) => {
    const step = await Step.findById(req.params.id).populate('material').populate('machine');
    if (!step) {
        throw new NotFoundError("Steps");
    }
    res.send(step);
});

export {router as readStepRouter};