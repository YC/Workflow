import { Request, Response, NextFunction } from 'express';
import isMongoId from 'validator/lib/isMongoId';

// Validates threadID param
export let validateID = (req: Request, res: Response, next: NextFunction) => {
    // Error when not valid
    if (!isMongoId(req.params.threadID)) {
        const err = new Error('Thread ID is not valid');
        err.status = 404;
        return next(err);
    }
    next();
};
