import mongoose from 'mongoose';

export interface MaterialAttrs {
    name: string,
    cost: number
}

interface MaterialModel extends mongoose.Model<MaterialDoc> {
    build(attrs: MaterialAttrs): MaterialDoc;
}

export interface MaterialDoc extends mongoose.Document {
    name: string,
    cost: number
}

const MaterialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
        }
    }
});

MaterialSchema.statics.build = (attrs: MaterialAttrs) => {
    return new Material(attrs);
};

const Material = mongoose.model<MaterialDoc, MaterialModel>('Material', MaterialSchema);

export {Material};