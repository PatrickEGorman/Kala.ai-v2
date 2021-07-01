import express, {Request, Response} from "express";
import {Machine} from "../models/Machine";


const router = express.Router();

router.get('/api/machines/', async (req: Request, res: Response) => {
    // todo: add tests
    const machines = await Machine.find().populate('Material');

    res.send(machines);
});

export {router as listMachineRouter};