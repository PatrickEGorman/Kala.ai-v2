import express, {Request, Response} from "express";
import {NotFoundError, validateRequest} from '@kala.ai/common';
import {body} from "express-validator";
import {InvMachine} from "../../models/InvMachine";
import {InvMachineCreatedPublisher} from "../../events/publishers/inv-machine-created-publisher";
import {natsWrapper} from "../../nats-wrapper";
import {Factory} from "../../models/Factory";
import {Machine} from "../../models/Machine";


const router = express.Router();

router.post('/api/machines/inventory', [
    body('factory')
        .not()
        .isEmpty()
        .withMessage("Factory is required"),
    body('machine')
        .not()
        .isEmpty()
        .withMessage("Machine is required"),
], validateRequest, async (req: Request, res: Response) => {

    const {
        factory, machine
    } = req.body;

    const factoryObj = await Factory.findById(factory);
    const machineObj = await Machine.findById(machine);

    if (!factoryObj && !machineObj) {
        throw new NotFoundError("Factory and Machine");
    }
    if (!factoryObj) {
        throw new NotFoundError("Factory");
    }
    if (!machineObj) {
        throw new NotFoundError("Machine");
    }

    const invMachine = await InvMachine.buildAndSave({
        factory: factoryObj, machine: machineObj
    });

    await new InvMachineCreatedPublisher(natsWrapper.client).publish({
        id: invMachine.id,
        factoryId: invMachine.factory.id,
        machineId: invMachine.machine.id
    })

    res.status(201).send({
        id: invMachine._id,
        _id: invMachine._id,
        machine: invMachine.machine,
        factory: {
            name: factoryObj.name,
            id: factoryObj.id,
            _id: factoryObj.id,
        },
    });
});

export {router as createInvMachineRouter}