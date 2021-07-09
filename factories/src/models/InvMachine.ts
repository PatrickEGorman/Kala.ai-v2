import mongoose from 'mongoose';
import {FactoryDoc} from "./Factory";
import {MachineDoc} from "./Machine";

export interface InvMachineAttrs {
    factory: FactoryDoc;
    machine: MachineDoc;
    _id: string;
}

interface InvMachineModel extends mongoose.Model<InvMachineDoc> {
    build(attrs: InvMachineAttrs): InvMachineDoc;
}

export interface InvMachineDoc extends mongoose.Document {
    factory: FactoryDoc;
    machine: MachineDoc;
}

const InvMachineSchema = new mongoose.Schema({
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

InvMachineSchema.statics.build = (attrs: InvMachineAttrs) => {
    return new InvMachine({
        _id: attrs._id,
        machine: attrs.machine,
        factory: attrs.factory
    });
};

const InvMachine = mongoose.model<InvMachineDoc, InvMachineModel>('InvMachine', InvMachineSchema);

export {InvMachine};