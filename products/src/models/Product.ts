import mongoose from 'mongoose';
import {StepDoc} from "./Step";

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
    }
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

const Product = mongoose.model<ProductDoc, ProductModel>('Product', ProductSchema);

export {Product};