import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Comment, { IComment } from './comment';

// Schema for thread
const threadSchema = new Schema(
    {
        parentID: { type: Schema.Types.ObjectId, required: true },
        memberID: { type: Schema.Types.ObjectId, required: true },
        title: { type: String, required: true },
        description: { type: String },
        comments: [Comment.schema],
        upvotes: [Schema.Types.ObjectId],
        tags: [String]
    },
    { timestamps: true }
);
threadSchema.set('toObject', { virtuals: true });
threadSchema.set('toJSON', { virtuals: true });

// Interface for thread
interface IThread {
    parentID: mongoose.Types.ObjectId;
    memberID: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    comments: IComment[];
    upvotes: mongoose.Types.ObjectId[];
    tags: [string];
}

// Initialise model and export
interface IThreadModel extends IThread, mongoose.Document {}
const Thread = mongoose.model<IThreadModel>('Thread', threadSchema);
export default Thread;
