import mongoose from 'mongoose';
import {BadRequestError, StepType} from "@kala.ai/common";
import {MachineDoc} from "./Machine";
import {Material, MaterialDoc} from "./Material";

interface StepAttrs {
    name: string;
    machine?: MachineDoc;
    material?: MaterialDoc;
    quantity?: number;
    stepTime: number;
}

interface StepModel extends mongoose.Model<StepDoc> {
    build(attrs: StepAttrs): StepDoc;
}

export interface StepDoc extends mongoose.Document {
    name: string;
    machine?: MachineDoc;
    material?: MaterialDoc;
    quantity?: number;
    stepTime: number;
}

const StepSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    machine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Machine"
    },
    material: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material"
    },
    quantity: {
        type: Number,
        min: 0
    },
    stepTime: {
        type: Number,
        required: true,
        min: 0
    },
    downTime: {
        type: Number,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
        }
    }
})

StepSchema.statics.build = async (attrs: StepAttrs) => {
    if (attrs.machine !== undefined && attrs.material !== undefined) {
        if (attrs.machine.material._id != attrs.material.id) {
            throw new BadRequestError("Step Material must be the same as the machine material");
        }
    } else if (attrs.machine !== undefined && !attrs.material) {
        attrs.material = attrs.machine.populate("material").material;
    }
    if (!attrs.material) {
        if (attrs.quantity !== 0 && attrs.quantity !== undefined) {
            throw new BadRequestError("Material quantity must be 0 for steps not involving a material");
        }
        attrs.quantity = 0;
    } else if (attrs.quantity === undefined || attrs.quantity <= 0) {
        throw new BadRequestError("Material quantity must be specified and positive for steps involving a material");
    }

    return new Step(attrs);
};

const Step = mongoose.model<StepDoc, StepModel>('Step', StepSchema);

export {Step};