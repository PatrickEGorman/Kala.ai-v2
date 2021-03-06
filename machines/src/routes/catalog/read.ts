import express, {Request, Response} from "express";
import {Machine} from "../../models/Machine";
import {NotFoundError} from "@kala.ai/common";


const router = express.Router();

router.get('/api/machines/catalog/:id', async (req: Request, res: Response) => {
    const machine = await Machine.findById(req.params.id).populate('material');
    if (!machine) {
        throw new NotFoundError;
    }

    res.send(machine);
});

export {router as readMachineRouter};