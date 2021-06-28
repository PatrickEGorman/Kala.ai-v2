import mongoose from 'mongoose';
import {MaterialFieldAttrs} from "@kala.ai/common";

interface MaterialModel extends mongoose.Model<MaterialDoc> {
    build(attrs: MaterialFieldAttrs): MaterialDoc;
}

export interface MaterialDoc extends mongoose.Document, MaterialFieldAttrs {
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

MaterialSchema.statics.build = (attrs: MaterialFieldAttrs) => {
    return new Material(attrs);
};

const Material = mongoose.model<MaterialDoc, MaterialModel>('Material', MaterialSchema);

export {Material};