import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import Redeemable from '../../models/redeemable';

// Retrieves redeemables
export let getRedeemables = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Get mongoose query parameters
    const filter: any = req.filter;
    const options: any = req.options;

    try {
        // Get redeemables
        const redeemables = await Redeemable.find(filter, undefined, options);
        // Get total number of matching redeemables with filter and set header
        const total: number = await Redeemable.countDocuments(filter);
        res.set('Content-Range', 'bytes */' + total);

        // Return redeemables
        res.json({
            redeemables: redeemables.map(redeemable => redeemable.toJSON())
        });
    } catch (err) {
        next(err);
    }
};

// Creates a redeemable
export let createRedeemable = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract information from body
    const name: string = req.body.name;
    const description: string = req.body.description;
    const rep: string = req.body.rep;

    try {
        // Create and save redeemable
        const redeemable = new Redeemable({
            name: name,
            description: description,
            rep: rep
        });
        await redeemable.save();

        // Return redeemable
        res.json(redeemable.toJSON());
    } catch (err) {
        next(err);
    }
};

// Retrieves the specified redeemable
export let getRedeemable = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract ID from request
    const redeemableID: string = req.params.redeemableID;

    try {
        // Get the redeemable and return it
        const redeemable = await Redeemable.findById(redeemableID);
        if (!redeemable) {
            const err: Error = new Error('Redeemable not found');
            err.status = 404;
            throw err;
        }
        res.json(redeemable.toJSON());
    } catch (err) {
        next(err);
    }
};

// Updates specified redeemable
export let updateRedeemable = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract ID and options from request
    const redeemableID: string = req.params.redeemableID;
    const data: any = req.body;

    try {
        // Update the redeemable
        const redeemable = await Redeemable.findByIdAndUpdate(
            redeemableID,
            { $set: data },
            { new: true, runValidators: true }
        );
        if (!redeemable) {
            const err: Error = new Error('Redeemable not found');
            err.status = 404;
            throw err;
        }
        // Return updated redeemable
        res.json(redeemable.toJSON());
    } catch (err) {
        next(err);
    }
};
