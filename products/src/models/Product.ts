import mongoose from 'mongoose';
import {ProcessDoc} from "./Process";

interface ProductAttrs {
    SKU: string;
    Name: string;
    Process: ProcessDoc;
    Variants: [{ name: string, materials: { type: string, amount: number, time: number }, image: String, price: number }];
    Complexity: number;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc;
}

interface ProductDoc extends mongoose.Document, ProductAttrs {
}

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    SKU: {
        type: String,
        unique: true,
        required: true
    },
    process: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    complexity: {
        type: Number,
        required: true,
        min: 0
    },
    variants: {
        type: [{name: String, materials: {type: String, amount: Number, time: Number}, image: String, price: Number}],
        required: true
    }
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