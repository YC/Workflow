import mongoose from 'mongoose';

// Schema for badge
const badgeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: String,
        active: { type: Boolean, default: true },
        avatar: { type: String }
    },
    { timestamps: true }
);
badgeSchema.set('toObject', { virtuals: true });
badgeSchema.set('toJSON', { virtuals: true });

// Interface for badge
interface IBadge {
    name: string;
    description?: string;
    active: boolean;
    avatar?: string;
}

// Initialise model and export
interface IBadgeModel extends IBadge, mongoose.Document {}
const Badge = mongoose.model<IBadgeModel>('Badge', badgeSchema);
export default Badge;
