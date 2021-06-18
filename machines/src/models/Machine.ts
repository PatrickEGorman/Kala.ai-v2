import mongoose from 'mongoose';
import {MachineFieldAttrs} from "@kala.ai/common";

interface MachineModel extends mongoose.Model<MachineDoc> {
    build(attrs: MachineFieldAttrs): MachineDoc;
}

interface MachineDoc extends mongoose.Document, MachineFieldAttrs {
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
        type: String
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

MachineSchema.statics.build = (attrs: MachineFieldAttrs) => {
    return new Machine(attrs);
};

const Machine = mongoose.model<MachineDoc, MachineModel>('Machine', MachineSchema);

export {Machine};