import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

// Import models/controllers
import Team from '../../models/team';
import * as PostController from '../post';

// Retrieves the posts of the specified team
export let getPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract info from request
    const teamID: string = req.params.teamID;

    try {
        // Get and return posts
        const posts = await PostController.getPosts(teamID);
        return res.json({ posts: posts.map(post => post.toJSON()) });
    } catch (err) {
        next(err);
    }
};

// Creates a post
export let createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract info from request
    const parentID: string = req.params.teamID;
    const memberID: string = req.user.id;
    const message: string = req.body.message;

    try {
        // Create post document
        const post = await PostController.createPost(
            parentID,
            memberID,
            req.files,
            message
        );

        // Add post to team.posts
        await Team.findOneAndUpdate(
            { _id: parentID },
            { $push: { posts: post.id } }
        );

        // Return post
        res.json(post.toJSON());
    } catch (err) {
        next(err);
    }
};

// Adds a comment
export let addComment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract info from request
    const memberID: mongoose.Types.ObjectId = req.user._id;
    const postID: string = req.params.postID;
    const parentID: string = req.params.teamID;
    const message: string = req.body.message;

    try {
        // Add comment and return post
        const post = await PostController.addComment(
            parentID,
            postID,
            memberID,
            message
        );
        res.json(post.toJSON());
    } catch (err) {
        next(err);
    }
};

// Adds the user's upvote for the specified post
export let upvotePost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract info from request
    const memberID: mongoose.Types.ObjectId = req.user._id;
    const postID: string = req.params.postID;
    const parentID: string = req.params.teamID;

    try {
        // Add upvote and return post
        const post = await PostController.addUpvote(parentID, postID, memberID);
        res.json(post.toJSON());
    } catch (err) {
        next(err);
    }
};

// Removes the user's upvote from the specified post
export let removePostUpvote = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract info from request
    const memberID: mongoose.Types.ObjectId = req.user.id;
    const postID: string = req.params.postID;
    const parentID: string = req.params.teamID;

    try {
        // Remove upvote and return post
        const post = await PostController.removeUpvote(
            parentID,
            postID,
            memberID
        );
        res.json(post.toJSON());
    } catch (err) {
        next(err);
    }
};
