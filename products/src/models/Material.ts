import mongoose from 'mongoose';

interface MaterialAttrs {
    id: string;
    name: string;
}

interface MaterialModel extends mongoose.Model<MaterialDoc> {
    build(attrs: MaterialAttrs): MaterialDoc;
}

export interface MaterialDoc extends mongoose.Document {
    name: string;
}

const MaterialSchema = new mongoose.Schema({
    name: {
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
    return new Material({
        _id: attrs.id,
        name: attrs.name
    });
};

const Material = mongoose.model<MaterialDoc, MaterialModel>('Material', MaterialSchema);

export {Material};