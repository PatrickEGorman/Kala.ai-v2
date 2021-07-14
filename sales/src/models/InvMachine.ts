import mongoose from 'mongoose';
import {FactoryDoc} from "./Factory";

export interface InvMachineAttrs {
    factory: FactoryDoc;
    machine: string;
    _id: string;
}

interface InvMachineModel extends mongoose.Model<InvMachineDoc> {
    build(attrs: InvMachineAttrs): InvMachineDoc;

    buildAndSave(attrs: InvMachineAttrs): InvMachineDoc;
}

export interface InvMachineDoc extends mongoose.Document {
    factory: FactoryDoc;
    machine: string;
}

const InvMachineSchema = new mongoose.Schema({
    factory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Factory',
        required: true
    },
    machine: {
        type: String,
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

InvMachineSchema.statics.buildAndSave = async (attrs: InvMachineAttrs) => {
    const invMachine = new InvMachine(attrs);
    await invMachine.save();
    attrs.factory.machines.push(invMachine);
    await attrs.factory.save();

    return invMachine;
};

const InvMachine = mongoose.model<InvMachineDoc, InvMachineModel>('InvMachine', InvMachineSchema);

export {InvMachine};