import express, {Request, Response} from "express";
import {NotFoundError, validateRequest} from '@kala.ai/common';
import {body} from "express-validator";
import {Product} from "../../models/Product";
import {ProductCreatedPublisher} from "../../events/publishers/product-created-publisher";
import {natsWrapper} from "../../nats-wrapper";
import mongoose from "mongoose";
import {Step, StepDoc} from "../../models/Step";


const router = express.Router();

router.post('/api/products/products/', [
    body('name')
        .not()
        .isEmpty()
        .withMessage("Name is required"),
    body("SKU")
        .not()
        .isEmpty()
        .withMessage("SKU is required"),
    body("steps")
        .not()
        .isEmpty()
        .withMessage("At least 1 Step is required"),
    body("value")
        .isFloat({gt: 0})
        .withMessage("Value must be greater than 0"),
], validateRequest, async (req: Request, res: Response) => {

    let {
        name, SKU, steps, value
    } = req.body;

    let stepList: StepDoc[] = [];

    for (let i in steps) {
        const step = await Step.findById(steps[i])
        if (!step) {
            throw new NotFoundError("Step");
        }
        stepList.push(step)
    }

    const product = Product.build({
        name, SKU, steps: stepList, value
    });

    await product.save();


    await new ProductCreatedPublisher(natsWrapper.client).publish({
        id: product.id,
        name: product.name,
        value: product.value,
        steps: product.steps.map(step => step._id)
    })

    res.status(201).send(product);
});

export {router as createProductRouter}