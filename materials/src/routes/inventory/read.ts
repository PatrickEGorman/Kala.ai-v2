import express, {Request, Response} from "express";
import {InvMaterial} from "../../models/InvMaterial";
import {NotFoundError} from "@kala.ai/common";


const router = express.Router();

router.get('/api/materials/inventory/:id', async (req: Request, res: Response) => {
    const invMaterial = await InvMaterial.findById(req.params.id).populate('material').populate('factory');
    ;
    if (!invMaterial) {
        throw new NotFoundError;
    }

    res.send(invMaterial);
});

export {router as readInvMaterialRouter};