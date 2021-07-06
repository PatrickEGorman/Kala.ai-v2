import express, {Request, Response} from "express";
import {InvMaterial} from "../../models/InvMaterial";


const router = express.Router();

router.get('/api/materials/inventory/', async (req: Request, res: Response) => {
    // todo: add tests
    const invMaterials = await InvMaterial.find().populate('material').populate('factory');

    res.send(invMaterials);
});

export {router as listInvMaterialRouter};