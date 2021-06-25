import mongoose from 'mongoose';
import {MaterialDoc} from "./Material";

export interface MachineAttrs {
    name: string;
    uptime: number;
    maintenanceTime: number;
    material: MaterialDoc;
    errorRate: number;
    initialCost: number;
    maintenanceCost: number;
    operationCost: number;
    laborCost?: number;
}

interface MachineModel extends mongoose.Model<MachineDoc> {
    build(attrs: MachineAttrs): MachineDoc;
}

interface MachineDoc extends mongoose.Document {
    name: string;
    uptime: number;
    maintenanceTime: number;
    material: MaterialDoc;
    errorRate: number;
    initialCost: number;
    maintenanceCost: number;
    operationCost: number;
    laborCost?: number;
}

const MachineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    factoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ticket'
    },
    maintenanceTime: {
        type: Number,
        required: true
    },
    uptime: {
        type: Number,
        required: true
    },
    material: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material'
    },
    errorRate: {
        type: Number
    },
    initialCost: {
        type: Number
    },
    maintenanceCost: {
        type: Number
    },
    operationCost: {
        type: Number
    },
    laborCost: {
        type: Number
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
        }
    }
});

MachineSchema.statics.build = (attrs: MachineAttrs) => {
    return new Machine(attrs);
};

const Machine = mongoose.model<MachineDoc, MachineModel>('Machine', MachineSchema);

export {Machine};