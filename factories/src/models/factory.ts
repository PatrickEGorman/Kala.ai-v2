import mongoose from 'mongoose';


interface FactoryAttrs {
    name: string;
    location: { lat: number, long: number };
    cost: number;
    storage: number;
    maintenanceTime: number;
    maintenanceCost: number;
}

interface FactoryModel extends mongoose.Model<FactoryDoc> {
    build(attrs: FactoryAttrs): FactoryDoc;
}

interface FactoryDoc extends mongoose.Document {
    name: string;
    location: { lat: number, long: number };
    cost: number;
    storage: number;
    maintenanceTime: number;
    maintenanceCost: number;
    uptime: number;
}

const FactorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: {lat: Number, long: Number},
        required: true
    },
    cost: {
        type: Number,
        required: true,
        min: 0
    },
    storage: {
        type: Number,
        required: true,
        min: 0
    },
    maintenanceTime: {
        type: Number,
        required: true,
        min: 0
    },
    maintenanceCost: {
        type: Number,
        required: true,
        min: 0
    },
    uptime: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
        }
    }
});

FactorySchema.statics.build = (attrs: FactoryAttrs) => {
    return new Factory(attrs);
};

const Factory = mongoose.model<FactoryDoc, FactoryModel>('Factory', FactorySchema);

export {Factory};