import express, {Request, Response} from "express";
import {NotFoundError, validateRequest} from "@kala.ai/common";
import {InvMachine} from "../../models/InvMachine";
import {natsWrapper} from "../../nats-wrapper";
import {InvMachineUpdatedPublisher} from "../../events/publishers/inv-machine-updated-publisher";
import {body} from "express-validator";


const router = express.Router();

// Route use for resetting or adjusting machines running up time; most likely after maintenance
router.post('/api/machines/inventory/:id',
    [
        body("uptime")
            .isFloat({min: 0})
            .withMessage("Uptime Time must be positive number"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const invMachine = await InvMachine.findById(req.params.id);
        if (!invMachine) {
            throw new NotFoundError;
        }

        const {
            uptime
        } = req.body;

        console.log(invMachine.uptime);

        invMachine.set({uptime});
        console.log(invMachine.uptime)

        await invMachine.save();


        await new InvMachineUpdatedPublisher(natsWrapper.client).publish({
            id: invMachine.id,
            uptime: invMachine.uptime
        });
        res.status(200).send(invMachine);
    });

export {router as updateInvMachineRouter}