import { Request, Response, NextFunction } from 'express';
import isMongoId from 'validator/lib/isMongoId';

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
        const err = new Error('User is not member');
        err.status = 403;
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
        const err = new Error('User is member');
        err.status = 403;
        next(err);
    }
};

// Validates memberID param
export let validateID = (req: Request, res: Response, next: NextFunction) => {
    if (!isMongoId(req.params.memberID)) {
        const err = new Error('Member ID is not valid');
        err.status = 404;
        return next(err);
    }
    next();
};
