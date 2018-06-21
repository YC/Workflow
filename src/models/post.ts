import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Comment, { IComment } from './comment';

// Schema for post
const postSchema = new Schema(
    {
        parentID: { type: Schema.Types.ObjectId, required: true },
        memberID: { type: Schema.Types.ObjectId, required: true },
        message: { type: String, required: true },
        upvotes: [Schema.Types.ObjectId],
        comments: [Comment.schema],
        photos: [String],
        rep: { type: Number }
    },
    { timestamps: true }
);
postSchema.set('toObject', { virtuals: true });
postSchema.set('toJSON', { virtuals: true });

// Define text index for posts
postSchema.index({ message: 'text', 'comments.message': 'text' });

// Interface for post
interface IPost {
    parentID: mongoose.Types.ObjectId;
    memberID: mongoose.Types.ObjectId;
    message: string;
    upvotes: mongoose.Types.ObjectId[];
    comments: IComment[];
    photos: string[];
    rep?: number;
}

// Initialise model and export
interface IPostModel extends IPost, mongoose.Document {}
const Post = mongoose.model<IPostModel>('Post', postSchema);
export default Post;
