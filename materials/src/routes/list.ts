import express, {Request, Response} from "express";
import {Material} from "../models/Material";
import {NotFoundError} from "@kala.ai/common";


const router = express.Router();

router.get('/api/materials/', async (req: Request, res: Response) => {
    // todo: add tests
    const materials = await Material.find();

    res.send(materials);
});

export {router as listMaterialRouter};