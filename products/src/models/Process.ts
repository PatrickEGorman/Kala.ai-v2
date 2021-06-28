import mongoose from 'mongoose';

interface ProcessAttrs {
    name: string;
}

interface ProcessModel extends mongoose.Model<ProcessDoc> {
    build(attrs: ProcessAttrs): ProcessDoc;
}

interface ProcessDoc extends mongoose.Document {
    name: string;
}

const ProcessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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

export {Process, ProcessDoc};