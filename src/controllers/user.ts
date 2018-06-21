import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

// Import models/controllers
import Member from '../models/member';
import Redeemable from '../models/redeemable';
import RedeemItem from '../models/redeemitem';
import * as MemberRepController from './member/member_rep';

// Handles user login
export let login = async (req: Request, res: Response, next: NextFunction) => {
    // Authenticate with passport
    passport.authenticate('local', function(err: any, user: any, info: any) {
        if (err) {
            return next(err);
        }
        // Return 401 if unauthorised
        req.login(user, function(err: any) {
            if (err) {
                err.message = 'Invalid username or password';
                err.status = 401;
                return next(err);
            }
            return res.json(
                user.toJSON({
                    transform: function(doc: any, ret: any, options: any) {
                        // Do not return the password hash
                        delete ret.password;
                        return ret;
                    }
                })
            );
        });
    })(req, res, next);
};

// Handles user logout
// Adapted from https://stackoverflow.com/questions/13758207
export let logout = async (req: Request, res: Response, next: NextFunction) => {
    req.logout();
    res.json({ status: 'success' });
};

// Returns user session by sending information of authenticated user
export let session = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Return the user of the session
    const user = req.user.toJSON({
        // Do not return the password hash
        transform: function(doc: any, ret: any, options: any) {
            delete ret.password;
            return ret;
        }
    });
    return res.json(user);
};

// Gets redeemed items of user
export let getUserRedeems = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract user ID
    const userID: string = req.user.id;

    try {
        // Get user redeems and return them
        const redeems = await Member.findById(
            userID,
            'id redeemItems'
        ).populate('redeemItems');
        return res.json(redeems.toJSON());
    } catch (err) {
        next(err);
    }
};

// Redeems an item
export let redeemItem = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract user/redeemable ID
    const memberID: string = req.user.id;
    const redeemableID: string = req.body.redeemableID;

    try {
        // Get the redeemable
        const redeemable = await Redeemable.findById(redeemableID);
        if (!redeemable) {
            const err = new Error('Redeemable could not be found');
            err.status = 404;
            throw err;
        }
        // Find amount of rep that is required to redeem the item
        const repRequired = redeemable.rep;

        // Initialise the RedeemItem
        const redeemItem = new RedeemItem({
            memberID: memberID,
            redeemableID: redeemable.id,
            rep: repRequired
        });

        // Reduce member's rep
        await MemberRepController.reduceRep(memberID, repRequired);

        // Save and return the RedeemItem
        await redeemItem.save();
        await Member.findOneAndUpdate(
            { _id: memberID },
            { $push: { redeemItems: redeemItem.id } }
        );
        return res.json(redeemItem.toJSON());
    } catch (err) {
        next(err);
    }
};
