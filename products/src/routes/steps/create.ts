import express, {Request, Response} from "express";
import {NotFoundError, validateRequest} from '@kala.ai/common';
import {body} from "express-validator";
import {Step} from "../../models/Step";
import {StepCreatedPublisher} from "../../events/publishers/step-created-publisher";
import {natsWrapper} from "../../nats-wrapper";
import {Material} from "../../models/Material";
import {Machine} from "../../models/Machine";


const router = express.Router();

router.post('/api/products/steps', [
    body("name")
        .not()
        .isEmpty()
        .withMessage("Name must be provided"),
    body("quantity")
        .default(0)
        .isFloat({min: 0})
        .withMessage("Quantity must be positive number"),
    body('stepTime')
        .isFloat({gt: 0})
        .withMessage("Step time must be a positive number"),
], validateRequest, async (req: Request, res: Response) => {

    let {
        material, machine, quantity, stepTime, name
    } = req.body;

    if (material !== "" && material !== undefined) {
        material = await Material.findById(material);
        if (!material) {
            throw new NotFoundError("Material");
        }
    } else {
        material = undefined;
    }
    if (machine !== "" && machine !== undefined) {
        machine = await Machine.findById(machine);
        if (!machine) {
            throw new NotFoundError("Machine");
        }
    } else {
        machine = undefined;
    }

    const step = await Step.build({
        material, machine, quantity, stepTime, name
    });

    await step.save();

    let materialId: string | undefined, machineId: string | undefined = undefined;

    if (step.material !== undefined) {
        materialId = step.material.id;
    }
    if (step.machine !== undefined) {
        machineId = step.machine.id;
    }

    // todo: add name to StepCreatedPublisher
    await new StepCreatedPublisher(natsWrapper.client).publish({
        id: step.id,
        // name: step.name,
        materialId,
        machineId,
        quantity: step.quantity,
        stepTime: step.stepTime
    })

    res.status(201).send(step);
});

export {router as createStepRouter}