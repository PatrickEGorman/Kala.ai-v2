import express, {Request, Response} from "express";
import {validateRequest} from '@kala.ai/common';
import {Product, ProductDoc} from "../models/Product";
import {FactoryDoc} from "../models/Factory";


const router = express.Router();

router.get('/api/sales/list', validateRequest, async (req: Request, res: Response) => {
    const products = await Product.find().populate('steps');

    const buildList: { product: ProductDoc, factories: FactoryDoc[] }[] = [];

    for (let product of products) {
        let factories = await product.factories();
        buildList.push({product, factories});
    }

    res.send({products: buildList})
});

export {router as canBuildListRouter}