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
    const testMaterial = await InvMaterial.findOne({material, factory});
    if (!testMaterial) {
        const factoryObj = await Factory.findById(factory);
        if (!factoryObj) {
            throw new NotFoundError("Factory");
        }

        const materialObj = await Material.findById(material);
        if (!materialObj) {
            throw new NotFoundError("Material");
        }

        const invMaterial = InvMaterial.build({
            factory: factoryObj,
            material: materialObj,
            quantity: quantity
        });

        factoryObj.materials.push(invMaterial);

        await invMaterial.save();

        await factoryObj.save();

        await new InvMaterialCreatedPublisher(natsWrapper.client).publish({
            id: invMaterial.id,
            materialId: invMaterial.material.id,
            factoryId: invMaterial.factory.id,
            quantity: invMaterial.quantity
        })

        res.status(201).send({
            id: invMaterial._id,
            _id: invMaterial._id,
            material: invMaterial.material,
            factory: {
                name: factoryObj.name,
                id: factoryObj.id,
                _id: factoryObj.id,
            },
            quantity: invMaterial.quantity
        });
    } else {
        res.redirect(307, `/api/materials/inventory/${testMaterial._id}`)
    }
});

export {router as createInvMaterialRouter}