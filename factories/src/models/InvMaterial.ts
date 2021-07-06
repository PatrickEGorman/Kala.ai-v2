import mongoose from 'mongoose';
import {FactoryDoc} from "./Factory";
import {Material, MaterialDoc} from "./Material";

export interface InvMaterialAttrs {
    quantity: number;
    factory: FactoryDoc;
    material: MaterialDoc;
    _id: string
}

interface InvMaterialModel extends mongoose.Model<InvMaterialDoc> {
    build(attrs: InvMaterialAttrs): InvMaterialDoc;
}

export interface InvMaterialDoc extends mongoose.Document {
    quantity: number;
    material: MaterialDoc;
    factory: FactoryDoc;
}

const InvMaterialSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    material: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material',
        required: true
    },
    factory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Factory',
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
        }
    }
});

InvMaterialSchema.statics.build = (attrs: InvMaterialAttrs) => {
    return new InvMaterial(attrs);
}

const InvMaterial = mongoose.model<InvMaterialDoc, InvMaterialModel>('InvMaterial', InvMaterialSchema);

export {InvMaterial};