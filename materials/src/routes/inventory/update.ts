import express, {Request, Response} from "express";
import {NotFoundError, validateRequest} from "@kala.ai/common";
import {InvMaterial} from "../../models/InvMaterial";
import {body} from "express-validator";
import {natsWrapper} from "../../nats-wrapper";
import {InvMaterialUpdatedPublisher} from "../../events/publishers/inv-material-updated-publisher";
import {NegativeQuantityError} from "../../errors/negative-quantity-error";


const router = express.Router();

// todo: allow transfer between factories
router.post('/api/materials/inventory/:id',
    body("quantity")
        .not()
        .isEmpty()
        .withMessage("Quantity is required")
        .isFloat()
        .withMessage("Quantity must be a number"),
    validateRequest,
    async (req: Request, res: Response) => {
        const invMaterial = await InvMaterial.findById(req.params.id);
        if (!invMaterial) {
            throw new NotFoundError;
        }
        const quantity = parseFloat(req.body.quantity) + invMaterial.quantity;

        // todo Redirect to delete if quantity is 0
        if (quantity >= 0) {
            invMaterial.set({quantity});
        } else {
            throw new NegativeQuantityError();
        }

        invMaterial.save();
        await new InvMaterialUpdatedPublisher(natsWrapper.client).publish({
            id: invMaterial.id,
            quantity: parseFloat(req.body.quantity),
            factoryId: invMaterial.factory.id
        })
        res.status(200).send(invMaterial);
    }
)
;

export {router as updateInvMaterialRouter}