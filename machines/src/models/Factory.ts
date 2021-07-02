import mongoose from 'mongoose';


export interface FactoryAttrs {
    id: string
    name: string;
    location: { lat: number, long: number };
}

interface FactoryModel extends mongoose.Model<FactoryDoc> {
    build(attrs: FactoryAttrs): FactoryDoc;
}

interface FactoryDoc extends mongoose.Document {
    name: string;
    location: { lat: number, long: number };
}

const FactorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: {lat: Number, long: Number},
        required: true
    }
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

const Factory = mongoose.model<FactoryDoc, FactoryModel>('Factory', FactorySchema);

export {Factory};