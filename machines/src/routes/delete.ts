import express, {Request, Response} from "express";
import {Machine} from "../models/Machine";
import {NotFoundError, validateRequest} from "@kala.ai/common";
import {MachineDeletedPublisher} from "../events/machine-deleted-publisher";
import {natsWrapper} from "../nats-wrapper";


const router = express.Router();

router.delete('/api/machines/:id', async (req: Request, res: Response) => {
    const machine = await Machine.findById(req.params.id);
    if (!machine) {
        throw new NotFoundError;
    }
    await machine.delete()

    await new MachineDeletedPublisher(natsWrapper.client).publish({
        id: machine.id,
        name: machine.name,
        uptime: machine.uptime,
        maintenanceTime: machine.maintenanceTime,
        factoryId: machine.factoryId,
        material: machine.material,
        errorRate: machine.errorRate,
        initialCost: machine.initialCost,
        maintenanceCost: machine.maintenanceCost,
        operationCost: machine.operationCost,
        laborCost: machine.laborCost
    })
    res.sendStatus(200);
});

export {router as deleteMachineRouter};