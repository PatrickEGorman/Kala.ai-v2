import express, {Request, Response} from "express";
import {InvMachine} from "../../models/InvMachine";
import {NotFoundError} from "@kala.ai/common";
import {InvMachineDeletedPublisher} from "../../events/publishers/inv-machine-deleted-publisher";
import {natsWrapper} from "../../nats-wrapper";


const router = express.Router();

// todo Add sell value to machine deletion?
router.delete('/api/machines/inventory/:id', async (req: Request, res: Response) => {
    const invMachine = await InvMachine.findById(req.params.id);
    if (!invMachine) {
        throw new NotFoundError;
    }
    await invMachine.delete()


    await new InvMachineDeletedPublisher(natsWrapper.client).publish({
        id: invMachine.id,
    })
    res.sendStatus(200);
});

export {router as deleteInvMachineRouter};