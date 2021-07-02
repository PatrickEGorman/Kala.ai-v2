import express, {Request, Response} from "express";
import {InvMachine} from "../../models/InvMachine";
import {NotFoundError} from "@kala.ai/common";


const router = express.Router();

router.get('/api/machines/inventory/:id', async (req: Request, res: Response) => {
    const invMachine = await InvMachine.findById(req.params.id).populate('factory').populate('machine').populate('material');
    if (!invMachine) {
        throw new NotFoundError;
    }
    res.send(invMachine);
});

export {router as readInvMachineRouter};