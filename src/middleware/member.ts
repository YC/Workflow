import { Request, Response, NextFunction } from 'express';
import ErrorStatus from '../helper/error';

// Ensures that the user is the requested member
export let userIsMember = (req: Request, res: Response, next: NextFunction) => {
    // If the user is an admin
    if (req.user.scope.includes('admin')) {
        return next();
    }

    // If the user's ID is equal to memberID, then the user is the member
    if (req.user.id === req.params.memberID) {
        return next();
    } else {
        const err = new ErrorStatus('User is not member', 403);
        next(err);
    }
};

// Ensures that the user is not the requested member
export let userIsNotMember = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // If the user is an admin
    if (req.user.scope.includes('admin')) {
        return next();
    }

    // If the user's ID is not equal to memberID, then the user is not
    // the member
    if (req.user.id.toString() !== req.params.memberID) {
        return next();
    } else {
        const err = new ErrorStatus('User is member', 403);
        next(err);
    }
};
