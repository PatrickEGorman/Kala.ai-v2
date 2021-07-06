import express, {Request, Response} from "express";
import {Material} from "../../models/Material";
import {NotFoundError} from "@kala.ai/common";


const router = express.Router();

router.get('/api/materials/catalog/:id', async (req: Request, res: Response) => {
    const material = await Material.findById(req.params.id);
    if (!material) {
        throw new NotFoundError;
    }

    res.send(material);
});

export {router as readMaterialRouter};