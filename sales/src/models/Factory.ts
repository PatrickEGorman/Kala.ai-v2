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

    inventory: { machines: string[], materials: Map<string, number> }
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
        type: mongoose.Schema.Types.ObjectId, ref: "InvMachine",
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

FactorySchema.virtual('inventory').get(function () {
    let machines: string[] = [];
    let materials = new Map<string, number>();

    // @ts-ignore
    for (let invMachine of this.machines) {
        if (!machines.includes(invMachine.machine)) {
            machines.push(invMachine.machine)
        }
    }
    // @ts-ignore
    for (let invMaterial of this.materials) {
        materials.set(invMaterial.material, invMaterial.quantity);
    }

    return {machines, materials}
})

const Factory = mongoose.model<FactoryDoc, FactoryModel>('Factory', FactorySchema);

export {Factory};