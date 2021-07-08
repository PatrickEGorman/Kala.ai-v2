import express, {Request, Response} from "express";
import {NotFoundError, validateRequest} from "@kala.ai/common";
import {Product} from "../../models/Product";
import {natsWrapper} from "../../nats-wrapper";
import {ProductUpdatedPublisher} from "../../events/publishers/product-updated-publisher";
import {body} from "express-validator";


const router = express.Router();

router.post('/api/products/products/:id',
    [
        body("value")
            .isFloat({gt: 0})
            .withMessage("Value must be positive number"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const product = await Product.findById(req.params.id);
        if (!product) {
            throw new NotFoundError;
        }

        const {
            value
        } = req.body;

        product.set({value})

        product.save();

        await new ProductUpdatedPublisher(natsWrapper.client).publish({
            id: product.id,
            value: product.value
        })
        res.status(200).send(product);
    });

export {router as updateProductRouter}