import mongoose from 'mongoose';
import {Step, StepDoc} from "./Step";
import {Factory, FactoryDoc} from "./Factory";

interface ProductAttrs {
    _id: string;
    name: string;
    steps: StepDoc[];
    value: number;
}

export interface ProductDoc extends mongoose.Document {
    name: string;
    steps: StepDoc[];
    value: number;

    requirements: { machines: string[], materials: Map<string, number> };

    factories(): Promise<FactoryDoc[]>
}

interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc;
}

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    steps: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Step'
        }],
        required: true
    },
    value: {
        type: Number,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
        },
        virtuals: true
    }
});

ProductSchema.statics.build = (attrs: ProductAttrs) => {
    return new Product(attrs);
};

ProductSchema.virtual('requirements').get(function () {
    let machines: string[] = [];
    let materials = new Map<string, number>();

    // @ts-ignore
    for (let step of this.steps) {
        if (!machines.includes(step.machine) && step.machine != undefined) {
            machines.push(step.machine)
        }
        if (step.material != undefined) {
            if (!materials.has(step.material)) {
                materials.set(step.material, step.quantity);
            } else {
                materials.set(step.material, materials.get(step.material) + step.quantity);
            }
        }
    }
    return {machines, materials};
})

ProductSchema.methods.factories = async function () {
    const factories = await Factory.find().populate('materials').populate('machines');
    const buildableFactories: FactoryDoc[] = [];
    // @ts-ignore
    const req = this.requirements;
    for (let factory of factories) {
        let canBuild = true;
        const inv = factory.inventory
        for (let machine of req.machines) {
            if (!inv.machines.includes(machine)) {
                canBuild = false;
                break;
            }
        }
        if (!canBuild) {
            continue;
        }
        for (let [material, quantity] of req.materials) {
            if (inv.materials.get(material) === undefined) {
                canBuild = false;
                break;
            }// @ts-ignore
            if (inv.materials.get(material) < quantity) {
                canBuild = false;
                break;
            }
        }
        if (canBuild) {
            buildableFactories.push(factory);
        }
    }
    return buildableFactories;
}

const Product = mongoose.model<ProductDoc, ProductModel>('Product', ProductSchema);

export {Product};