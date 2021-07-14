import mongoose from 'mongoose';
import {InvMaterialDoc} from "./InvMaterial";
import {InvMachineDoc} from "./InvMachine";


export interface FactoryAttrs {
    id: string
    name: string;
    location: { lat: number, long: number };
}

interface FactoryModel extends mongoose.Model<FactoryDoc> {
    build(attrs: FactoryAttrs): FactoryDoc;
}

export interface FactoryDoc extends mongoose.Document {
    name: string;
    location: { lat: number, long: number };
    materials: InvMaterialDoc[];
    machines: InvMachineDoc[];
}

const FactorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: {lat: Number, long: Number},
        required: true
    },
    materials: [{
        type: mongoose.Schema.Types.ObjectId, ref: "InvMaterial",
    }],
    machines: [{
        type: mongoose.Schema.Types.ObjectId, ref: "InvMaterial",
    }],
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
        }
    }
});

FactorySchema.statics.build = (attrs: FactoryAttrs) => {
    return new Factory({
        _id: attrs.id,
        name: attrs.name,
        location: attrs.location
    });
};

const Factory = mongoose.model<FactoryDoc, FactoryModel>('Factory', FactorySchema);

export {Factory};