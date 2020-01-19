import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

// Import Post/Comment model and upload helper
import Post from '../models/post';
import Comment from '../models/comment';
import { uploadDirectoryFromRoot } from '../helper/pic_upload';
import ErrorStatus from '../helper/error';

// Retrieves posts with the specified parentID
export let getPosts = async (parentID: string) => {
    try {
        // Get and return posts
        const posts = await Post.find({ parentID: parentID });
        return posts;
    } catch (err) {
        throw err;
    }
};

// Creates and returns a post document
// Note: Caller will be responsible for adding/attaching the post
export let createPost = async (
    parentID: string,
    memberID: string,
    files: any,
    message: string,
    rep: number = 0
) => {
    // Create post
    const post: any = {
        parentID: parentID,
        memberID: memberID,
        message: message,
        photos: []
    };

    // If post includes a rep amount, add the rep amount to the post
    if (rep) {
        post.rep = rep;
    }

    // If the post contains photos, add the file paths
    if (files) {
        for (const file of files) {
            post.photos.push(uploadDirectoryFromRoot + file.filename);
        }
    }

    // Create post from post object
    const postDocument = new Post(post);

    // Save and return saved post
    try {
        return await postDocument.save();
    } catch (err) {
        err.status = 422;
        throw err;
    }
};

// Adds a comment to a post
export let addComment = async function(
    parentID: string,
    postID: string,
    memberID: mongoose.Types.ObjectId,
    message: string
) {
    // Get the post
    const post = await Post.findById(postID);

    // Ensure that the parentIDs are equal
    if (!(post.parentID.toString() === parentID)) {
        const err = new ErrorStatus('Post parent is different', 400);
        throw err;
    }

    // Create the comment
    const comment = new Comment({
        memberID: memberID,
        message: message
    });

    // Insert and return
    try {
        post.comments.push(comment);
        return await post.save();
    } catch (err) {
        err.status = 422;
        throw err;
    }
};

// Adds an upvote to the post
export let addUpvote = async function(
    parentID: string,
    postID: string,
    memberID: mongoose.Types.ObjectId
) {
    // Get the post
    const post = await Post.findById(postID);

    // Ensure that the parentIDs are equal
    if (!(post.parentID.toString() === parentID)) {
        const err = new ErrorStatus('Post parent is different', 400);
        throw err;
    }

    // Ensure that member has not already upvoted
    for (const upvotedMemberID of post.upvotes) {
        if (upvotedMemberID.equals(memberID)) {
            const err = new ErrorStatus('Member has already upvoted', 400);
            throw err;
        }
    }

    // Add the upvote, save, and return post
    post.upvotes.push(memberID);
    return await post.save();
};

// Removes an upvote from the post
export let removeUpvote = async function(
    parentID: string,
    postID: string,
    memberID: mongoose.Types.ObjectId
) {
    // Get the post
    const post = await Post.findById(postID);

    // Ensure that the parentIDs are equal
    if (!(post.parentID.toString() === parentID)) {
        const err = new ErrorStatus('Post parent is different', 400);
        throw err;
    }

    // Perform removal/return error
    const index: number = post.upvotes.indexOf(memberID);
    if (index >= 0) {
        // Member's ID has been found, perform removal
        post.upvotes.splice(index, 1);
        return await post.save();
    } else {
        // Member's ID is missing
        const err: Error = new ErrorStatus(
            'Member has not upvoted or has already \
            removed upvote',
            400
        );
        throw err;
    }
};
