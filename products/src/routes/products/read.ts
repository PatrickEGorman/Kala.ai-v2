import express, {Request, Response} from "express";
import {Product} from "../../models/Product";
import {NotFoundError} from "@kala.ai/common";


const router = express.Router();

router.get('/api/products/products/:id', async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id).populate({
        path: "steps",
        populate: {
            path: "machine"
        }
    }).populate({
        path: "steps",
        populate: {
            path: "material"
        }
    });
    if (!product) {
        throw new NotFoundError;
    }

    res.send(product);
});

export {router as readProductRouter};