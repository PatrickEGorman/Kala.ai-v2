import mongoose from 'mongoose';
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
    machines: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "InvMachine"
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