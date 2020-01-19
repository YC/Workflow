import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

// Import member model
import Member from '../../models/member';
// Import controllers which handle posts and reputation
import * as PostController from '../post';
import * as MemberRepController from './member_rep';
import ErrorStatus from '../../helper/error';

// Retrieves posts of specified member
export let getPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract info from request
    const memberID: string = req.params.memberID;

    try {
        // Retrieve and return posts
        const posts = await PostController.getPosts(memberID);
        return res.json({ posts: posts.map(post => post.toJSON()) });
    } catch (err) {
        next(err);
    }
};

// Creates a post and attaches it to the specified member
export let createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract info from request
    const parentID: string = req.params.memberID;
    const userID: string = req.user.id;
    const message: string = req.body.message;

    try {
        // Extract and verify rep (as it's a post to a member's page)
        const rep: number = Number(req.body.rep);
        if (!rep) {
            const err: Error = new ErrorStatus(
                "Need to specify rep to post to member's page",
                400
            );
            throw err;
        }

        // Create the post
        const post = await PostController.createPost(
            parentID,
            userID,
            req.files,
            message,
            rep
        );
        // Transfer rep to recipient user
        await MemberRepController.transferRep(userID.toString(), parentID, rep);

        // Add Post to member.posts
        await Member.findOneAndUpdate(
            { _id: parentID },
            { $push: { posts: post.id } }
        );

        // Return post
        res.json(post.toJSON());
    } catch (err) {
        next(err);
    }
};

// Adds a comment to the specified post
export let addComment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract info from request
    const userID: mongoose.Types.ObjectId = req.user._id;
    const postID: string = req.params.postID;
    const parentID: string = req.params.memberID;
    const message: string = req.body.message;

    try {
        // Add comment and return updated post
        const post = await PostController.addComment(
            parentID,
            postID,
            userID,
            message
        );
        res.json(post.toJSON());
    } catch (err) {
        next(err);
    }
};

// Upvotes the specified post for the authenticated user
export let upvotePost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract info from request
    const userID: mongoose.Types.ObjectId = req.user._id;
    const postID: string = req.params.postID;
    const parentID: string = req.params.memberID;

    try {
        // Add upvote and return updated post
        const post = await PostController.addUpvote(parentID, postID, userID);
        res.json(post.toJSON());
    } catch (err) {
        next(err);
    }
};

// Negates an upvote for the specified post by the authenticated user
export let removePostUpvote = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract info from request
    const userID: mongoose.Types.ObjectId = req.user._id;
    const postID: string = req.params.postID;
    const parentID: string = req.params.memberID;

    try {
        // Remove upvote and return updated post
        const post = await PostController.removeUpvote(
            parentID,
            postID,
            userID
        );
        res.json(post.toJSON());
    } catch (err) {
        next(err);
    }
};
