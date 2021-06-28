import express, {Request, Response} from "express";
import {NotFoundError, validateRequest} from "@kala.ai/common";
import {Machine} from "../models/Machine";
import {natsWrapper} from "../nats-wrapper";
import {MachineUpdatedPublisher} from "../events/machine-updated-publisher";


const router = express.Router();

router.post('/api/machines/:id',
    validateRequest,
    async (req: Request, res: Response) => {
        // todo: check operator authorization
        const machine = await Machine.findById(req.params.id);
        if (!machine) {
            throw new NotFoundError;
        }

        const {
            uptime, maintenanceTime, material, errorRate, maintenanceCost, operationCost,
            laborCost
        } = req.body;

        uptime ? machine.set({uptime: uptime}) : console.log("Uptime not changed")
        maintenanceTime ? machine.set({maintenanceTime: maintenanceTime}) : console.log("MaintenanceTime not changed")
        maintenanceCost ? machine.set({maintenanceCost: maintenanceCost}) : console.log("MaintenanceCost not changed")
        laborCost ? machine.set({laborCost: laborCost}) : console.log("LaborCost not changed")
        errorRate ? machine.set({errorRate: errorRate}) : console.log("ErrorRate not changed")
        operationCost ? machine.set({operationCost: operationCost}) : console.log("OperationCost not changed")
        material ? machine.set({material: material}) : console.log("Material not changed")

        machine.save();

        await new MachineUpdatedPublisher(natsWrapper.client).publish({
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
        res.status(200).send(machine);
    });

export {router as updateMachineRouter}