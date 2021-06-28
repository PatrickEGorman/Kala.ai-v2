import mongoose from 'mongoose';
import {StepType} from "@kala.ai/common";

interface StepAttrs {
    name: string;
    machine?: string;
    stepTime: number;
}

interface StepModel extends mongoose.Model<StepDoc> {
    build(attrs: StepAttrs): StepDoc;
}

export interface StepDoc extends mongoose.Document {
    name: string;
    machine?: string;
    stepTime: number;
}

const StepSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    machine: {
        type: String
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

StepSchema.statics.build = (attrs: StepAttrs) => {
    return new Step(attrs);
};

const Step = mongoose.model<StepDoc, StepModel>('Step', StepSchema);

export {Step};