import mongoose from 'mongoose';
import {ProcessFieldAttrs, StepType} from "@kala.ai/common";

interface ProcessModel extends mongoose.Model<ProcessDoc> {
    build(attrs: ProcessFieldAttrs): ProcessDoc;
}

interface ProcessDoc extends mongoose.Document, ProcessFieldAttrs {
}

const ProcessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    // Steps can be process or intermediate steps
    steps: {
        type: [{
            id: mongoose.Schema.Types.ObjectId, stepTime: {type: Number, min: 0},
            downTime: {type: Number, min: 0}, stepType: StepType
        }],
        default: undefined,
        required: true,
        ref: 'steps'
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
        }
    }
});

ProcessSchema.statics.build = (attrs: ProcessFieldAttrs) => {
    return new Process(attrs);
};

const Process = mongoose.model<ProcessDoc, ProcessModel>('Process', ProcessSchema);

export {Process};