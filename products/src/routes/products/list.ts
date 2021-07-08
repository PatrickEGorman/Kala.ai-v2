import express, {Request, Response} from "express";
import {Product} from "../../models/Product";


const router = express.Router();

router.get('/api/products/products/', async (req: Request, res: Response) => {
    // todo: add tests
    const products = await Product.find().populate('steps');

    res.send(products);
});

export {router as listProductRouter};