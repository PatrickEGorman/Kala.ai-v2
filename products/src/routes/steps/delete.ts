import express, {Request, Response} from "express";
import {Step} from "../../models/Step";
import {NotFoundError} from "@kala.ai/common";
import {StepDeletedPublisher} from "../../events/publishers/step-deleted-publisher";
import {natsWrapper} from "../../nats-wrapper";


const router = express.Router();

// todo Add sell value to machine deletion?
router.delete('/api/products/steps/:id', async (req: Request, res: Response) => {
    const step = await Step.findById(req.params.id);
    if (!step) {
        throw new NotFoundError("Step");
    }
    await step.delete()


    await new StepDeletedPublisher(natsWrapper.client).publish({
        id: step.id,
    })
    res.sendStatus(200);
});

export {router as deleteStepRouter};