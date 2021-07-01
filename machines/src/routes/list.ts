import express, {Request, Response} from "express";
import {Machine} from "../models/Machine";
import {NotFoundError} from "@kala.ai/common";


const router = express.Router();

router.get('/api/materials/', async (req: Request, res: Response) => {
    // todo: add tests
    const machines = await Machine.find().populate('Material');

    res.send(machines);
});

export {router as listMachineRouter};