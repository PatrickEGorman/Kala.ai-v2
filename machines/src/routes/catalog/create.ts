import express, {Request, Response} from "express";
import {NotFoundError, validateRequest} from '@kala.ai/common';
import {body} from "express-validator";
import {Machine} from "../../models/Machine";
import {MachineCreatedPublisher} from "../../events/publishers/machine-created-publisher";
import {natsWrapper} from "../../nats-wrapper";
import {Material} from "../../models/Material";


const router = express.Router();

router.post('/api/machines/catalog', [
    body('name')
        .not()
        .isEmpty()
        .withMessage("Name is required"),
    body("maintenanceTime")
        .isFloat({gt: 0})
        .withMessage("Maintenance Time must be greater than 0"),
    body("errorRate")
        .isFloat({gt: 0})
        .withMessage("Error Rate must be greater than 0")
        .isFloat({lt: 1})
        .withMessage("Error rate must be less than 1"),
    body("initialCost")
        .isFloat({gt: 0})
        .withMessage("initialCost must be greater than 0"),
    body("maintenanceCost")
        .isFloat({gt: 0})
        .withMessage("maintenanceCost must be greater than 0"),
    body("laborCost")
        .isFloat({gt: 0})
        .withMessage("laborCost must be greater than 0"),
    body("material")
        .not()
        .isEmpty()
        .withMessage("Material is required")
], validateRequest, async (req: Request, res: Response) => {

    const {
        name, maintenanceTime, material, errorRate, initialCost, maintenanceCost,
        operationCost, laborCost
    } = req.body;

    const materialObj = await Material.findById(material);
    if (!materialObj) {
        throw new NotFoundError();
    }
    const machine = Machine.build({
        name, maintenanceTime, material: materialObj, errorRate, initialCost, maintenanceCost,
        operationCost, laborCost
    });

    await machine.save();


    // todo: remove uptime from machine created publisher
    await new MachineCreatedPublisher(natsWrapper.client).publish({
        id: machine.id,
        name: machine.name,
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