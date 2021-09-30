import mongoose from 'mongoose';

interface StepAttrs {
    _id: string;
    machine?: string;
    material?: string;
    quantity?: number;
    stepTime: number;
}

interface StepModel extends mongoose.Model<StepDoc> {
    build(attrs: StepAttrs): StepDoc;
}

export interface StepDoc extends mongoose.Document {
    machine?: string;
    material?: string;
    quantity?: number;
    stepTime: number;
}

const StepSchema = new mongoose.Schema({
    machine: {
        type: String
    },
    material: {
        type: String
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