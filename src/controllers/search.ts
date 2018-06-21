import { Request, Response, NextFunction } from 'express';

// Import models
import Member from '../models/member';
import Team from '../models/team';
import Post from '../models/post';

// Handles search
// https://docs.mongodb.com/manual/reference/operator/query/text/#sort-by-text-search-score
export let search = async (req: Request, res: Response, next: NextFunction) => {
    // Extract userID from params
    const userID: string = req.user.id;
    // Get the query
    const query: string = req.query.q;
    // Define case-insensitive regex search
    const re: RegExp = new RegExp(query, 'i');

    // Search for active members with query, and return top 5 matches
    // with limited fields
    // Adapted from: https://stackoverflow.com/questions/11725708
    let members: any;
    try {
        members = await Member.find()
            .or([{ firstname: { $regex: re } }, { lastname: { $regex: re } }])
            .select('firstname lastname username id')
            .limit(5);
    } catch (err) {
        throw err;
    }

    // Search for team posts, and return top 5 matches
    let posts;
    try {
        // Get teams for which user is member
        const member_teams = await Team.find({
            members: userID
        }).select('id');
        // Get teams for which user is manager
        const manager_teams = await Team.find({
            managers: userID
        }).select('id');
        // Get teams for user
        const teams = member_teams.concat(manager_teams);

        // Search posts with query
        posts = await Post.find(
            {
                $text: { $search: query, $diacriticSensitive: false },
                parentID: teams
            },
            { score: { $meta: 'textScore' } }
        )
            .sort({ score: { $meta: 'textScore' } })
            .limit(5);
    } catch (err) {
        throw err;
    }

    // Return matched members/posts
    res.json({
        members: members.map((member: any) => member.toJSON()),
        posts: posts.map((post: any) => post.toJSON())
    });
};
