import mongoose from 'mongoose';
import {StepType} from "@kala.ai/common";

interface StepAttrs {
    name: string;
    machineName?: string;
    stepTime: number;
}

interface StepModel extends mongoose.Model<StepDoc> {
    build(attrs: StepAttrs): StepDoc;
}

export interface StepDoc extends mongoose.Document {
    stepType?: StepType;
    name: string;
    machineName?: string;
    stepTime: number;
}

const StepSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    machineName: {
        type: String
    },
    stepType: {
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
    let step = new Step(attrs);

    if (attrs.machineName) {
        step.stepType = StepType.machine;
    } else {
        step.stepType = StepType.intermediate;
    }
    return step;
};

const Step = mongoose.model<StepDoc, StepModel>('Step', StepSchema);

export {Step};