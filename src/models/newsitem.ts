import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Schema for news item
const newsItemSchema = new mongoose.Schema(
    {
        teamID: { type: Schema.Types.ObjectId },
        message: { type: String, required: true }
    },
    { timestamps: true }
);
newsItemSchema.set('toObject', { virtuals: true });
newsItemSchema.set('toJSON', { virtuals: true });

// Interface for news item
export interface INewsItem {
    teamID?: mongoose.Types.ObjectId;
    message: string;
}
interface INewsItemModel extends INewsItem, mongoose.Document {}

// Initialise model and export
const NewsItem = mongoose.model<INewsItemModel>('NewsItem', newsItemSchema);
export default NewsItem;
