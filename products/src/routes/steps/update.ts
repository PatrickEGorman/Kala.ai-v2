import express, {Request, Response} from "express";
import {NotFoundError, validateRequest} from "@kala.ai/common";
import {Step} from "../../models/Step";
import {natsWrapper} from "../../nats-wrapper";
import {StepUpdatedPublisher} from "../../events/publishers/step-updated-publisher";
import {body} from "express-validator";


const router = express.Router();

// Route use for resetting or adjusting machines running up time; most likely after maintenance
router.post('/api/products/steps/:id',
    [
        body("stepTime")
            .default(0)
            .isFloat({min: 0})
            .withMessage("Uptime Time must be positive number"),
        body("quantity")
            .default(0)
            .isFloat({min: 0})
            .withMessage("Uptime Time must be positive number"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const step = await Step.findById(req.params.id);
        if (!step) {
            throw new NotFoundError("Step");
        }

        const {
            quantity,
            stepTime
        } = req.body;

        quantity > 0 ? step.set({quantity}) : {}
        stepTime > 0 ? step.set({stepTime}) : {}

        await step.save();

        await new StepUpdatedPublisher(natsWrapper.client).publish({
            id: step.id,
            stepTime: step.stepTime,
            quantity: step.quantity
        });

        res.status(200).send(step);
    });

export {router as updateStepRouter}