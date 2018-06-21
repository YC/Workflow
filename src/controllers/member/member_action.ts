import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

// Import models
import RedeemItem from '../../models/redeemitem';
import Member from '../../models/member';
import Redeemable from '../../models/redeemable';

// Import controllers/helpers
import * as MemberRepController from './member_rep';
import { processAvatar } from '../../helper/avatar_upload';

// Updates a member
export let updateMember = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract memberID from param
    const memberID: string = req.params.memberID;

    try {
        // Set changed content
        let content: any = {};
        if (req.body.bio) {
            content['bio'] = req.body.bio;
        }
        // Allow admins to change every field
        if (req.user.scope.includes('admin')) {
            content = req.body;
        }

        // Update member and return
        const member = await Member.findByIdAndUpdate(
            memberID,
            { $set: content },
            { new: true, runValidators: true, upsert: true }
        ).select({ posts: 0, redeemItems: 0 });
        // Throw error if member does not exist
        if (!member) {
            const err: Error = new Error('Cannot find member');
            err.status = 404;
            throw err;
        }

        res.json(member.toJSON());
    } catch (err) {
        next(err);
    }
};

// Updates avatar of specified member
export let updateMemberAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract ID from request
    const id: string = req.params.memberID;

    try {
        if (req.file) {
            // Process the avatar and get the filename
            const filename: string = await processAvatar(req.file);

            // Update member.avatar and return the updated member
            const member = await Member.findByIdAndUpdate(
                id,
                { avatar: filename },
                { new: true, runValidators: true, upsert: true }
            ).select({ posts: 0, redeemItems: 0 });
            res.json(member.toJSON());
        } else {
            // If there is no file payload
            const err: Error = new Error('Missing file payload');
            err.status = 422;
            throw err;
        }
    } catch (err) {
        next(err);
    }
};
