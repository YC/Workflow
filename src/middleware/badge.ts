import { Request, Response, NextFunction } from 'express';
import isMongoId from 'validator/lib/isMongoId';

// Validates badgeID param
export let validateID = (req: Request, res: Response, next: NextFunction) => {
    // Error when not valid
    if (!isMongoId(req.params.badgeID)) {
        const err = new Error('Badge ID is not valid');
        err.status = 404;
        return next(err);
    }
    next();
};
