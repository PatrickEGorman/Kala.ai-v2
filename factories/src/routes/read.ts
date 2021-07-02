import express, {Request, Response} from "express";
import {Factory} from "../models/factory";
import {NotFoundError} from "@kala.ai/common";


const router = express.Router();

router.get('/api/factories/:id', async (req: Request, res: Response) => {
    const factory = await Factory.findById(req.params.id).populate('material');
    if (!factory) {
        throw new NotFoundError;
    }

    res.send(factory);
});

export {router as readFactoryRouter};