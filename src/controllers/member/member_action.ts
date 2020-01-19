import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

// Import models
import Member from '../../models/member';

// Import controllers/helpers
import { processAvatar } from '../../helper/avatar_upload';
import ErrorStatus from '../../helper/error';

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
            const err: Error = new ErrorStatus('Cannot find member', 404);
            throw err;
        }

        res.json(member);
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
            res.json(member);
        } else {
            // If there is no file payload
            const err: Error = new ErrorStatus('Missing file payload', 422);
            throw err;
        }
    } catch (err) {
        next(err);
    }
};
