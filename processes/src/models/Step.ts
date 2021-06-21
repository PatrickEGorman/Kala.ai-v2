import mongoose from 'mongoose';
import {StepType} from "@kala.ai/common";

interface StepAttrs {
    stepType: StepType;
    name: string;
    machineName?: string;
    stepTime: number;
    downTime?: number;
}

interface StepModel extends mongoose.Model<StepDoc> {
    build(attrs: StepAttrs): StepDoc;
}

export interface StepDoc extends mongoose.Document, StepAttrs {
}

const StepSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    stepType: {
        type: String,
        required: true
    },
    machineName: {
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
});

StepSchema.statics.build = (attrs: StepAttrs) => {
    return new Step(attrs);
};

const Step = mongoose.model<StepDoc, StepModel>('Step', StepSchema);

export {Step};