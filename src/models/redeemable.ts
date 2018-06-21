import mongoose from 'mongoose';

// Schema for redeemable items
const redeemableSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: String,
        rep: {
            type: Number,
            required: true,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} must be an Integer'
            }
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);
redeemableSchema.set('toObject', { virtuals: true });
redeemableSchema.set('toJSON', { virtuals: true });

// Interface for redeemable
interface IRedeemable {
    name: string;
    description?: string;
    rep: number;
}
interface IRedeemableModel extends IRedeemable, mongoose.Document {}

// Initialise model and export
const Redeemable = mongoose.model<IRedeemableModel>(
    'Redeemable',
    redeemableSchema
);
export default Redeemable;
