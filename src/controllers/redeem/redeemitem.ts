import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import RedeemItem from '../../models/redeemitem';
import * as MemberRepController from '../member/member_rep';
import ErrorStatus from '../../helper/error';

// Retrieves redeemed items
export let getRedeemed = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Get mongoose query parameters
    const filter: any = req.filter;
    const options: any = req.options;

    try {
        // Find all redeemItems
        const redeemItems = await RedeemItem.find(filter, undefined, options);
        // Get total number of matching redeemItems with filter and set header
        const total: number = await RedeemItem.countDocuments(filter);
        res.set('Content-Range', 'bytes */' + total);

        // Return retrieved redeemItems
        res.json({
            redeemables: redeemItems.map(item => item.toJSON())
        });
    } catch (err) {
        next(err);
    }
};

// Gets specified redeemed item by ID
export let getRedeemItem = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract ID from request
    const id: string = req.params.redeemItemID;

    try {
        // Get the specified redeemitem and return it
        const redeemItem = await RedeemItem.findById(id);
        if (!redeemItem) {
            const err: Error = new ErrorStatus('Redeemable not found', 404);
            throw err;
        }
        res.json(redeemItem.toJSON());
    } catch (err) {
        next(err);
    }
};

// Updates specified redeem item
export let updateRedeemItem = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract ID and options from request
    const id: string = req.params.redeemItemID;
    const data: any = req.body;

    // Refund the rep, if applicable
    try {
        const redeemItem = await RedeemItem.findById(id);
        if (!redeemItem) {
            const err: Error = new ErrorStatus('Redeem Item not found', 404);
            throw err;
        }
        // If the item was pending but the admin wants to reject it
        if (redeemItem.status == 'Pending' && data.status == 'Rejected') {
            // Refund the rep to the original user
            await MemberRepController.reduceRep(
                redeemItem.memberID.toString(),
                -redeemItem.rep
            );
        }
    } catch (err) {
        throw err;
    }

    try {
        // Update and return the redeem item
        const redeemItem = await RedeemItem.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true, upsert: true }
        );
        if (!redeemItem) {
            const err: Error = new ErrorStatus('Redeem Item not found', 404);
            throw err;
        }
        res.json(redeemItem);
    } catch (err) {
        next(err);
    }
};
