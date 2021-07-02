import express, {Request, Response} from "express";
import {Factory} from "../models/factory";


const router = express.Router();

router.get('/api/factories/', async (req: Request, res: Response) => {
    // todo: add tests
    const factories = await Factory.find().populate('material');

    res.send(factories);
});

export {router as listFactoryRouter};