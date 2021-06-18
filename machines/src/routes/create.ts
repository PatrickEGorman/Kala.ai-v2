import express, {Request, Response} from "express";
import {validateRequest} from '@kala.ai/common';
import {body} from "express-validator";
import {Machine} from "../models/Machine";
import {MachineCreatedPublisher} from "../events/machine-created-publisher";
import {natsWrapper} from "../nats-wrapper";


const router = express.Router();

router.post('/api/machines', [
    body('name')
        .not()
        .isEmpty()
        .withMessage("name is required"),
], validateRequest, async (req: Request, res: Response) => {

    const {
        name, factoryId, maintenanceTime, material, errorRate, initialCost, maintenanceCost,
        operationCost, laborCost
    } = req.body;
    const uptime = 0;
    // todo: verify factoryId belongs to factory
    // todo: increment quantity if it already exists
    // todo: add authorization for operator to create machine_fields
    // todo: subtract initial cost from budget
    const machine = Machine.build({
        name, factoryId, uptime, maintenanceTime, material, errorRate, initialCost, maintenanceCost,
        operationCost, laborCost
    });

    await machine.save();

    await new MachineCreatedPublisher(natsWrapper.client).publish({
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

    res.status(201).send(machine);
});

export {router as createMachineRouter}