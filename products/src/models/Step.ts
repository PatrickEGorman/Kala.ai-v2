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
        required: true
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
    },
    stepTime: {
        type: Number,
        required: true
    },
    downTime: {
        type: Number,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
        }
    }
})

StepSchema.statics.build = async (attrs: StepAttrs) => {
    if (typeof attrs.machine != undefined && typeof attrs.material != undefined) {
        if (attrs.machine!.material._id != attrs.material!.id) {
            throw new BadRequestError("Step Material must be the same as the machine material")
        }
    } else if (typeof attrs.machine != undefined && !attrs.material) {
        // @ts-ignore
        attrs.material = await Material.findById(attrs.machine!.material.id);
    } else if (!attrs.machine && !attrs.material) {
        attrs.quantity = 0;
    }

    return new Step(attrs);
};

const Step = mongoose.model<StepDoc, StepModel>('Step', StepSchema);

export {Step};