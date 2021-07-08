import express, {Request, Response} from "express";
import {Step} from "../../models/Step";


const router = express.Router();

router.get('/api/products/steps/', async (req: Request, res: Response) => {
    // todo: add tests
    const steps = await Step.find().populate("machine").populate("material");

    res.send(steps);
});

export {router as listStepRouter};