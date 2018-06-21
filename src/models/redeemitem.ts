import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Schema for redeemed items
const redeemItemSchema = new mongoose.Schema(
    {
        memberID: { type: Schema.Types.ObjectId, required: true },
        redeemableID: { type: Schema.Types.ObjectId, required: true },
        rep: {
            type: Number,
            required: true,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} must be an Integer'
            }
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending'
        }
    },
    { timestamps: true }
);
redeemItemSchema.set('toObject', { virtuals: true });
redeemItemSchema.set('toJSON', { virtuals: true });

// Interface for redeem item
interface IRedeemItem {
    memberID: mongoose.Types.ObjectId;
    redeemableID: mongoose.Types.ObjectId;
    rep: number;
    status: string;
}

// Initialise model and export
interface IRedeemItemModel extends IRedeemItem, mongoose.Document {}
const RedeemItem = mongoose.model<IRedeemItemModel>(
    'RedeemItem',
    redeemItemSchema
);
export default RedeemItem;
