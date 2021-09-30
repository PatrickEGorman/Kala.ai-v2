import mongoose from 'mongoose';
import {StepDoc} from "./Step";
import {MaterialDoc} from "./Material";
import {MachineDoc} from "./Machine";

interface ProductAttrs {
    SKU: string;
    name: string;
    steps: StepDoc[];
    value: number
}

interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc;
}

interface ProductDoc extends mongoose.Document {
    SKU: string;
    name: string;
    steps: StepDoc[];
    value: number;

    requirements(): { machines: MachineDoc[], materials: Map<MaterialDoc, number>[] }
}

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    SKU: {
        type: String,
        unique: true,
        required: true
    },
    steps: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Step"
        }],
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    // complexity: {
    //     type: Number,
    //     required: true,
    //     min: 0
    // }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
        }
    }
});

ProductSchema.statics.build = (attrs: ProductAttrs) => {
    return new Product(attrs);
};

ProductSchema.methods.requirements = function () {
    let machines: MachineDoc[] = [];
    let materials = new Map<MaterialDoc, number>();

    // @ts-ignore
    for (let step of this.steps) {
        if (!machines.includes(step.machine)) {
            machines.push(step.machine)
        }
        if (!Array.from(materials.keys()).includes(step.material)) {
            materials.set(step.material, step.quantity)
        } else {
            materials.set(step.material, materials.get(step.material) + step.quantity);
        }
    }
    return {machines, materials};
}

const Product = mongoose.model<ProductDoc, ProductModel>('Product', ProductSchema);

export {Product};