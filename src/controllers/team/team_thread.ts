import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

// Import models
import Team from '../../models/team';
import Thread from '../../models/thread';
import Comment from '../../models/comment';
import ErrorStatus from '../../helper/error';

// Retrieves the threads of the specified team
export let getThreads = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract info from request
    const teamID: string = req.params.teamID;

    // Find threads belonging to team and return them
    try {
        const threads = await Thread.find({ parentID: teamID });
        return res.json({ threads: threads.map(thread => thread.toJSON()) });
    } catch (err) {
        next(err);
    }
};

// Creates a thread
export let createThread = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract info from request
    const parentID: string = req.params.teamID;
    const memberID: string = req.user.id;
    const title: string = req.body.title;
    const description: string = req.body.description;

    // Create thread
    const thread = new Thread({
        parentID,
        memberID,
        title,
        description
    });

    // Save thread
    try {
        await thread.save();
    } catch (err) {
        err.status = 422;
        return next(err);
    }

    // Add Thread to team.threads
    await Team.findOneAndUpdate(
        { _id: parentID },
        { $push: { threads: thread._id } }
    );

    // Return thread
    res.json(thread.toJSON());
};

// Adds a comment to a thread
export let addComment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract info from request
    const memberID: string = req.user.id;
    const threadID: string = req.params.threadID;
    const parentID: string = req.params.teamID;
    const message: string = req.body.message;

    // Get the thread
    let thread;
    try {
        thread = await Thread.findById(threadID);
        if (!thread) {
            const err: Error = new ErrorStatus('Thread not found', 404);
            throw err;
        }
    } catch (err) {
        return next(err);
    }

    // Ensure that the parentIDs are equal
    if (!(thread.parentID.toString() === parentID)) {
        const err: Error = new ErrorStatus('Post parent is different', 400);
        return next(err);
    }

    // Create the comment
    const comment = new Comment({
        memberID: memberID,
        message: message
    });

    // Attach comment to thread and return updated thread
    try {
        thread.comments.push(comment);
        await thread.save();
        res.json(thread.toJSON());
    } catch (err) {
        err.status = 422;
        next(err);
    }
};

// Add the user's upvote for the specified thread
export let upvoteThread = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract info from request
    const memberID: mongoose.Types.ObjectId = req.user._id;
    const threadID: string = req.params.threadID;
    const parentID: string = req.params.teamID;

    try {
        // Get the thread
        const thread = await Thread.findById(threadID);
        // Ensure that the parentIDs are equal
        if (!(thread.parentID.toString() === parentID)) {
            const err: Error = new ErrorStatus('Post parent is different', 400);
            throw err;
        }

        // Ensure that member has not already upvoted
        for (const upvotedMemberID of thread.upvotes) {
            if (upvotedMemberID.equals(memberID)) {
                const err: Error = new ErrorStatus(
                    'Member has already upvoted',
                    400
                );
                throw err;
            }
        }

        // Add the upvote, save, and return the updated thread
        thread.upvotes.push(memberID);
        await thread.save();
        res.json(thread.toJSON());
    } catch (err) {
        next(err);
    }
};

// Removes the user's upvote for the specified thread
export let removeThreadUpvote = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract info from request
    const memberID: mongoose.Types.ObjectId = req.user._id;
    const threadID: string = req.params.threadID;
    const parentID: string = req.params.teamID;

    try {
        // Get the thread
        const thread = await Thread.findById(threadID);
        // Ensure that the parentIDs are equal
        if (!(thread.parentID.toString() === parentID)) {
            const err: Error = new ErrorStatus('Post parent is different', 400);
            throw err;
        }

        // Perform removal/return error
        const index: number = thread.upvotes.indexOf(memberID);
        // Member's ID is missing
        if (index < 0) {
            const err: Error = new ErrorStatus(
                'Member has not upvoted or has already removed upvote',
                400
            );
            throw err;
        }

        // Member's ID has been found, perform removal
        thread.upvotes.splice(index, 1);
        await thread.save();
        // Return updated thread
        res.json(thread.toJSON());
    } catch (err) {
        next(err);
    }
};
