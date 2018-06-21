import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Schema for badge item
const badgeItemSchema = new Schema(
    {
        badgeID: { type: Schema.Types.ObjectId, required: true },
        awarderID: { type: Schema.Types.ObjectId, required: true },
        teamID: { type: Schema.Types.ObjectId },
        comment: String
    },
    { timestamps: true }
);
badgeItemSchema.set('toObject', { virtuals: true });
badgeItemSchema.set('toJSON', { virtuals: true });

// Interface for badge item
export interface IBadgeItem {
    badgeID: mongoose.Types.ObjectId;
    awarderID: mongoose.Types.ObjectId;
    teamID: mongoose.Types.ObjectId;
    comment?: string;
}

// Initialise model and export
export interface IBadgeItemModel extends IBadgeItem, mongoose.Document {}
const BadgeItem = mongoose.model<IBadgeItemModel>('BadgeItem', badgeItemSchema);
export default BadgeItem;
