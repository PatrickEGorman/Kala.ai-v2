import express, {Request, Response} from "express";
import {Product} from "../../models/Product";
import {NotFoundError} from "@kala.ai/common";
import {ProductDeletedPublisher} from "../../events/publishers/product-deleted-publisher";
import {natsWrapper} from "../../nats-wrapper";

const router = express.Router();

router.delete('/api/products/products/:id', async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new NotFoundError;
    }
    await product.delete()

    await new ProductDeletedPublisher(natsWrapper.client).publish({
        id: product.id,
    })
    res.sendStatus(200);
});

export {router as deleteProductRouter};