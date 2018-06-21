import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Schema for comment
const commentSchema = new Schema(
    {
        memberID: { type: Schema.Types.ObjectId, required: true },
        message: { type: String, required: true }
    },
    { timestamps: true }
);
commentSchema.set('toObject', { virtuals: true });
commentSchema.set('toJSON', { virtuals: true });

// Adapted from
// https://github.com/Appsilon/styleguide/wiki/mongoose-typescript-models
// Interface for comment
export interface IComment {
    memberID: mongoose.Types.ObjectId;
    message: string;
    upvotes: mongoose.Types.ObjectId[];
}
interface ICommentModel extends IComment, mongoose.Document {}

// Initialise model and export
const Comment = mongoose.model<ICommentModel>('Comment', commentSchema);
export default Comment;
