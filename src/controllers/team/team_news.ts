import { Request, Response, NextFunction } from 'express';

// Import models/controllers
import NewsItem from '../../models/newsitem';
import Team from '../../models/team';
import * as TeamController from './team';

// Creates a news item
export let createNewsItem = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract info from request
    const teamID: string = req.params.teamID;
    const message: string = req.body.message;

    try {
        // Create a new NewsItem document
        const newsItem = new NewsItem({
            teamID: teamID,
            message: message
        });

        // Get the team with newsItem field
        const team = await Team.findById(teamID, 'newsItems');
        if (!team) {
            const err = new Error('Team could not be found');
            err.status = 404;
            throw err;
        }

        // Add the news item to the team, save it and return it
        await newsItem.save();
        team.newsItems.push(newsItem);
        await team.save();
        res.json(newsItem.toJSON());
    } catch (err) {
        next(err);
    }
};
