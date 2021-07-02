import express, {Request, Response} from "express";
import {InvMachine} from "../../models/InvMachine";


const router = express.Router();

router.get('/api/machines/inventory/', async (req: Request, res: Response) => {
    // todo: add tests
    const invMachines = await InvMachine.find().populate('factory').populate('machine').populate('material');

    res.send(invMachines);
});

export {router as listInvMachineRouter};