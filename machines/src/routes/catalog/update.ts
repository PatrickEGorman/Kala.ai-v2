import express, {Request, Response} from "express";
import {NotFoundError, validateRequest} from "@kala.ai/common";
import {Machine} from "../../models/Machine";
import {natsWrapper} from "../../nats-wrapper";
import {MachineUpdatedPublisher} from "../../events/publishers/machine-updated-publisher";
import {body} from "express-validator";


const router = express.Router();

router.post('/api/machines/catalog/:id',
    [
        body("maintenanceTime")
            .default(0)
            .isFloat({min: 0})
            .withMessage("Maintenance Time must be positive number"),
        body("errorRate")
            .default(0)
            .isFloat({min: 0})
            .withMessage("Error Rate must be positive number")
            .isFloat({lt: 1})
            .withMessage("Error rate must be less than 1"),
        body("initialCost")
            .default(0)
            .isFloat({min: 0})
            .withMessage("initialCost must be positive number"),
        body("maintenanceCost")
            .default(0)
            .isFloat({min: 0})
            .withMessage("maintenanceCost must positive number"),
        body("laborCost")
            .default(0)
            .isFloat({min: 0})
            .withMessage("laborCost must be positive number"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const machine = await Machine.findById(req.params.id);
        if (!machine) {
            throw new NotFoundError;
        }

        const {
            maintenanceTime, errorRate, maintenanceCost, operationCost,
            laborCost, initialCost
        } = req.body;


        maintenanceTime > 0 ? machine.set({maintenanceTime: maintenanceTime}) : console.log("MaintenanceTime not" +
            " changed")
        maintenanceCost > 0 ? machine.set({maintenanceCost: maintenanceCost}) : console.log("MaintenanceCost not changed")
        laborCost > 0 ? machine.set({laborCost: laborCost}) : console.log("LaborCost not changed")
        errorRate > 0 ? machine.set({errorRate: errorRate}) : console.log("ErrorRate not changed")
        operationCost > 0 ? machine.set({operationCost: operationCost}) : console.log("OperationCost not changed")
        initialCost > 0 ? machine.set({initialCost}) : console.log("InitialCost not changed")

        await machine.save();

        // todo: remove name and material from updated publisher object
        await new MachineUpdatedPublisher(natsWrapper.client).publish({
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
        res.status(200).send(machine);
    });

export {router as updateMachineRouter}