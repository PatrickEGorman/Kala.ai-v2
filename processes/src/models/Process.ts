import mongoose from 'mongoose';
import {StepDoc} from "./Step";

interface ProcessAttrs {
    name: string;
    steps: [StepDoc]
}

interface ProcessModel extends mongoose.Model<ProcessDoc> {
    build(attrs: ProcessAttrs): ProcessDoc;
}

interface ProcessDoc extends mongoose.Document, ProcessAttrs {
}

const ProcessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    // Steps can be process or intermediate steps
    steps: {
        type: [
            mongoose.Schema.Types.ObjectId
        ],
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

ProcessSchema.statics.build = (attrs: ProcessAttrs) => {
    return new Process(attrs);
};

const Process = mongoose.model<ProcessDoc, ProcessModel>('Process', ProcessSchema);

export {Process};