import mongoose from 'mongoose';
import Badge from '../models/badge';
import { Request, Response, NextFunction } from 'express';

// Creates a badge
export let createBadge = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract required fields from body of request
    const name: string = req.body.name;
    const description: string = req.body.description;

    try {
        // Create a new badge document, save it and return it
        const badge = new Badge({ name: name, description: description });
        await badge.save();
        res.json(badge.toJSON());
    } catch (err) {
        // Return 422 if validation fails
        err.status = 422;
        next(err);
    }
};

// Retrieves badges
export let getBadges = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Get mongoose query parameters
    const filter: any = req.filter;
    const options: any = req.options;

    try {
        // Get badges
        const badges = await Badge.find(filter, undefined, options);
        // Get total number of badges for filter and set header
        const total: number = await Badge.countDocuments(filter);
        res.set('Content-Range', 'bytes */' + total);

        // Return response
        res.json({ badges: badges.map(badge => badge.toJSON()) });
    } catch (err) {
        next(err);
    }
};

// Retrieves the specified badge by its ID
export let getBadge = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract badgeID from request
    const badgeID: string = req.params.badgeID;

    try {
        // Query for the specified badge and return it
        const badge = await Badge.findById(badgeID);
        // Return 404 if not found
        if (!badge) {
            const err: Error = new Error('Badge not found');
            err.status = 404;
            throw err;
        }
        res.json(badge.toJSON());
    } catch (err) {
        next(err);
    }
};

// Updates specified badge
export let updateBadge = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract ID and payload from request
    const badgeID: string = req.params.badgeID;
    const data: any = req.body;

    try {
        // Update the badge and return it
        const badge = await Badge.findByIdAndUpdate(
            badgeID,
            { $set: data },
            { new: true, runValidators: true }
        );
        // Return 404 if not found
        if (!badge) {
            const err: Error = new Error('Badge not found');
            err.status = 404;
            throw err;
        }
        res.json(badge.toJSON());
    } catch (err) {
        next(err);
    }
};

// Updates the avatar of the specified badge
import { processAvatar } from '../helper/avatar_upload';
export let updateBadgeAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract ID from request
    const badgeID: string = req.params.badgeID;

    try {
        if (req.file) {
            // Process the avatar and get the filename
            const filename: string = await processAvatar(req.file);

            // Update the badge and return it
            const badge = await Badge.findByIdAndUpdate(
                badgeID,
                { avatar: filename },
                { new: true, runValidators: true, upsert: true }
            );
            res.json(badge.toJSON());
        } else {
            // Return 422 if update fails
            const err: Error = new Error('Missing file payload');
            err.status = 422;
            throw err;
        }
    } catch (err) {
        next(err);
    }
};
