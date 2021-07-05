import express, {Request, Response} from "express";
import {NotFoundError, validateRequest} from '@kala.ai/common';
import {body} from "express-validator";
import {InvMaterial} from "../../models/InvMaterial";
import {InvMaterialCreatedPublisher} from "../../events/publishers/inv-material-created-publisher";
import {natsWrapper} from "../../nats-wrapper";
import {Factory} from "../../models/Factory";
import {Material} from "../../models/Material";


const router = express.Router();

router.post('/api/materials/inventory', [
    body('material')
        .not()
        .isEmpty()
        .withMessage("Material is required"),
    body("factory")
        .not()
        .isEmpty()
        .withMessage("Factory is required"),
    body("quantity")
        .isFloat({gt: 0})
        .withMessage("Quantity must be positive number")
], validateRequest, async (req: Request, res: Response) => {
    const {factory, material, quantity} = req.body;
    // todo: increment quantity if it already exists
    // todo: add authorization for operator to create invMaterial_fields
    // todo: subtract cost from budget

    const factoryObj = await Factory.findById(factory);
    if (!factoryObj) {
        throw new NotFoundError();
    }

    const materialObj = await Material.findById(material);
    if (!materialObj) {
        throw new NotFoundError();
    }

    const invMaterial = InvMaterial.build({
        factory: factoryObj,
        material: materialObj,
        quantity: quantity
    });

    await invMaterial.save();

    await new InvMaterialCreatedPublisher(natsWrapper.client).publish({
        id: invMaterial.id,
        materialId: invMaterial.material.id,
        factoryId: invMaterial.factory.id,
        quantity: invMaterial.quantity
    })

    res.status(201).send(invMaterial);
});

export {router as createInvMaterialRouter}