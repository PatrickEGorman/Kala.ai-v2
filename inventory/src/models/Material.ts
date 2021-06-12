import mongoose from 'mongoose';


interface MaterialAttrs {
    name: string,
    cost: number,
    quantity: number,
    factoryId: string
}

interface MaterialModel extends mongoose.Model<MaterialDoc> {
    build(attrs: MaterialAttrs): MaterialDoc;
}

interface MaterialDoc extends mongoose.Document {
    name: string,
    cost: number,
    quantity: number,
    factoryId: string
}

const MaterialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    factoryId: {
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

MaterialSchema.statics.build = (attrs: MaterialAttrs) => {
    return new Material(attrs);
};

const Material = mongoose.model<MaterialDoc, MaterialModel>('Material', MaterialSchema);

export {Material};