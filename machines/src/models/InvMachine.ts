import mongoose from 'mongoose';
import {FactoryDoc} from "./Factory";
import {MachineDoc} from "./Machine";
import {Material, MaterialDoc} from "./Material";

export interface InvMachineAttrs {
    factory: FactoryDoc;
    machine: MachineDoc;
}

interface InvMachineModel extends mongoose.Model<InvMachineDoc> {
    build(attrs: InvMachineAttrs): InvMachineDoc;
}

interface InvMachineDoc extends mongoose.Document {
    material: MaterialDoc;
    uptime: number;
    totalAge: number;
    factory: FactoryDoc;
    machine: MachineDoc;
}

const InvMachineSchema = new mongoose.Schema({
    totalAge: {
        Number
    },
    uptime: {
        Number
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
    },
    machine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Machine',
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
        }
    }
});

InvMachineSchema.statics.build = async (attrs: InvMachineAttrs) => {
    const material = await Material.findById(attrs.machine.material._id);
    return new InvMachine({
        material,
        machine: attrs.machine,
        factory: attrs.factory,
        uptime: 0,
        totalAge: 0
    });
};

const InvMachine = mongoose.model<InvMachineDoc, InvMachineModel>('InvMachine', InvMachineSchema);

export {InvMachine};