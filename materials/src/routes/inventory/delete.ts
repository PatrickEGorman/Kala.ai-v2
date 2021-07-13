import express, {Request, Response} from "express";
import {InvMaterial} from "../../models/InvMaterial";
import {NotFoundError} from "@kala.ai/common";
import {InvMaterialDeletedPublisher} from "../../events/publishers/inv-material-deleted-publisher";
import {natsWrapper} from "../../nats-wrapper";
import {Factory} from "../../models/Factory";


const router = express.Router();

router.delete('/api/materials/inventory/:id', async (req: Request, res: Response) => {
    const invMaterial = await InvMaterial.findById(req.params.id);
    if (!invMaterial) {
        throw new NotFoundError("Inventory Material");
    }

    const factory = await Factory.findById(invMaterial.factory);
    if (!factory) {
        throw new NotFoundError("Factory")
    }

    const index = factory.materials.indexOf(invMaterial);
    factory.materials.splice(index);
    await factory.save();

    await invMaterial.delete()

    await new InvMaterialDeletedPublisher(natsWrapper.client).publish({id: invMaterial.id})
    res.sendStatus(200);
});

export {router as deleteInvMaterialRouter};