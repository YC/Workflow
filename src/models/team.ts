import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import NewsItem, { INewsItem } from './newsitem';

// Schema for team
const teamSchema = new Schema(
    {
        name: { type: String, required: true },
        shortName: { type: String, required: true, unique: true },
        avatar: String,
        members: [Schema.Types.ObjectId],
        managers: [Schema.Types.ObjectId],
        active: { type: Boolean, default: true },
        posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
        threads: [{ type: Schema.Types.ObjectId, ref: 'Thread' }],
        newsItems: [mongoose.model('NewsItem').schema],
        rep: {
            type: Number,
            required: true,
            default: 0,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} must be an Integer'
            }
        }
    },
    { timestamps: true }
);
teamSchema.set('toObject', { virtuals: true });
teamSchema.set('toJSON', { virtuals: true });

// Interface for team
interface ITeam {
    name: string;
    shortName: string;
    avatar?: string;
    members: mongoose.Types.ObjectId[] | string[];
    managers: mongoose.Types.ObjectId[] | string[];
    active: boolean;
    posts: mongoose.Types.ObjectId[];
    threads: mongoose.Types.ObjectId[];
    rep: number;
    newsItems: INewsItem[];
}

// Initialise model and export
interface ITeamModel extends ITeam, mongoose.Document {}
const Team = mongoose.model<ITeamModel>('Team', teamSchema);
export default Team;
