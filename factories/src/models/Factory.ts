import mongoose from 'mongoose';
import {InvMaterialDoc} from "./InvMaterial";
import {InvMachineDoc} from "./InvMachine";


export interface FactoryAttrs {
    name: string;
    location: { lat: number, long: number };
    cost: number;
    storage: number;
    maintenanceTime: number;
    maintenanceCost: number;
}

interface FactoryModel extends mongoose.Model<FactoryDoc> {
    build(attrs: FactoryAttrs): FactoryDoc;
}

export interface FactoryDoc extends mongoose.Document {
    name: string;
    location: { lat: number, long: number };
    cost: number;
    storage: number;
    maintenanceTime: number;
    maintenanceCost: number;
    uptime: number;
    machines: [InvMachineDoc];
    materials: [InvMaterialDoc];
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
    cost: {
        type: Number,
        required: true,
        min: 0
    },
    storage: {
        type: Number,
        required: true,
        min: 0
    },
    maintenanceTime: {
        type: Number,
        required: true,
        min: 0
    },
    maintenanceCost: {
        type: Number,
        required: true,
        min: 0
    },
    uptime: {
        type: Number,
        default: 0,
        min: 0
    },
    machines: [{
        type: mongoose.Schema.Types.ObjectId, ref: "InvMachine",
    }],
    materials: [{
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
    return new Factory(attrs);
};

const Factory = mongoose.model<FactoryDoc, FactoryModel>('Factory', FactorySchema);

export {Factory};