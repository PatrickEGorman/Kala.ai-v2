import express, {Request, Response} from "express";
import {NotFoundError, validateRequest} from '@kala.ai/common';
import {Product} from "../models/Product";


const router = express.Router();

router.get('/api/sales/read/:id', validateRequest, async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id).populate('steps');
    if (!product) {
        throw new NotFoundError("Product")
    }

    const factories = await product.factories;

    res.send({product, factories})
});

export {router as canBuildReadRouter}