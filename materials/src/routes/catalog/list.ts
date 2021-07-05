import express, {Request, Response} from "express";
import {Material} from "../../models/Material";


const router = express.Router();

router.get('/api/materials/catalog/', async (req: Request, res: Response) => {
    // todo: add tests
    const materials = await Material.find();

    res.send(materials);
});

export {router as listMaterialRouter};