import mongoose from 'mongoose';
import {Step, StepDoc} from "./Step";

interface ProcessAttrs {
    name: string;
    steps: [StepDoc];
    machines: any;
}

interface ProcessModel extends mongoose.Model<ProcessDoc> {
    build(attrs: ProcessAttrs): ProcessDoc;
}

interface ProcessDoc extends mongoose.Document {
    name: string;
    steps: [StepDoc];
}

const ProcessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    // Steps can be process or intermediate steps
    steps: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Step'
        }],
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
        }
    }
});

ProcessSchema.virtual('machines').get(async function () {
    let machines: any[] = [];

    // @ts-ignore
    const process = await this.populate('steps');

    process.steps[1].machine;
    for (let step in process.steps) {
        if (process.steps[step].machine) {
            machines.push(process.steps[step].machine)
        }
    }
    return machines;

})

ProcessSchema.statics.build = (attrs: ProcessAttrs) => {
    return new Process(attrs);
};

const Process = mongoose.model<ProcessDoc, ProcessModel>('Process', ProcessSchema);

export {Process};