import { Request, Response, NextFunction } from 'express';
import isMongoId from 'validator/lib/isMongoId';

// Validates postID param
export let validateID = (req: Request, res: Response, next: NextFunction) => {
    // Error when ID is not valid
    if (!isMongoId(req.params.postID)) {
        const err = new Error('Post ID is not valid');
        err.status = 404;
        return next(err);
    }
    next();
};
