import mongoose from 'mongoose';
import {FactoryDoc} from "./Factory";

export interface InvMaterialAttrs {
    quantity: number;
    factory: FactoryDoc;
    material: string;
    _id: string
}

interface InvMaterialModel extends mongoose.Model<InvMaterialDoc> {
    build(attrs: InvMaterialAttrs): InvMaterialDoc;

    buildAndSave(attrs: InvMaterialAttrs): InvMaterialDoc;
}

export interface InvMaterialDoc extends mongoose.Document {
    quantity: number;
    material: string;
    factory: FactoryDoc;
}

const InvMaterialSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    material: {
        type: String,
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

InvMaterialSchema.statics.buildAndSave = async (attrs: InvMaterialAttrs) => {
    const invMaterial = new InvMaterial(attrs);
    await invMaterial.save();
    attrs.factory.materials.push(invMaterial);
    await attrs.factory.save();
    return invMaterial;
}


const InvMaterial = mongoose.model<InvMaterialDoc, InvMaterialModel>('InvMaterial', InvMaterialSchema);

export {InvMaterial};