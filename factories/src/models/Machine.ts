import mongoose from 'mongoose';
import {MaterialDoc} from "./Material";

interface MachineAttrs {
    id: string;
    name: string;
    material: MaterialDoc;
}

interface MachineModel extends mongoose.Model<MachineDoc> {
    build(attrs: MachineAttrs): MachineDoc;
}

export interface MachineDoc extends mongoose.Document {
    name: string;
    material: MaterialDoc;
}

const MachineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    material: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
        }
    }
});

MachineSchema.statics.build = (attrs: MachineAttrs) => {
    return new Machine({
        _id: attrs.id,
        name: attrs.name,
        material: attrs.material
    });
};

const Machine = mongoose.model<MachineDoc, MachineModel>('Machine', MachineSchema);

export {Machine};