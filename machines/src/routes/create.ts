import express, {Request, Response} from "express";
import {NotFoundError, validateRequest} from '@kala.ai/common';
import {body} from "express-validator";
import {Machine} from "../models/Machine";
import {MachineCreatedPublisher} from "../events/machine-created-publisher";
import {natsWrapper} from "../nats-wrapper";
import {Material} from "../models/Material";


const router = express.Router();

router.post('/api/machines', [
    body('name')
        .not()
        .isEmpty()
        .withMessage("name is required"),
], validateRequest, async (req: Request, res: Response) => {

    const {
        name, maintenanceTime, material, errorRate, initialCost, maintenanceCost,
        operationCost, laborCost
    } = req.body;

    const materialObj = await Material.findById(material);
    if (!materialObj) {
        throw new NotFoundError();
    }
    const uptime = 0;
    const machine = Machine.build({
        name, uptime, maintenanceTime, material: materialObj, errorRate, initialCost, maintenanceCost,
        operationCost, laborCost
    });

    await machine.save();

    await new MachineCreatedPublisher(natsWrapper.client).publish({
        id: machine.id,
        name: machine.name,
        uptime: machine.uptime,
        maintenanceTime: machine.maintenanceTime,
        material: machine.material._id,
        errorRate: machine.errorRate,
        initialCost: machine.initialCost,
        maintenanceCost: machine.maintenanceCost,
        operationCost: machine.operationCost,
        laborCost: machine.laborCost
    })

    res.status(201).send(machine);
});

export {router as createMachineRouter}