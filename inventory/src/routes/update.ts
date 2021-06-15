import express, {Request, Response} from "express";
import {NotFoundError, validateRequest} from "@kala.ai/common";
import {Material} from "../models/Material";


const router = express.Router();

router.post('/api/inventory/:id',
    validateRequest,
    async (req: Request, res: Response) => {
        // todo: check operator authorization
        // todo: subtract cost from budget
        const material = await Material.findById(req.params.id);
        if (!material) {
            throw new NotFoundError;
        }

        let changed = false;

        if(req.body.quantity){
            material.set({quantity:req.body.quantity})
            changed = true;
        }
        if(req.body.cost){
            material.set({cost:req.body.cost})
            changed = true
        }
        if(changed) {
            await material.save()
        }

        res.status(200).send(material);
    });

export {router as updateMaterialRouter}