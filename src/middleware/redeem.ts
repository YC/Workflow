import { Request, Response, NextFunction } from 'express';
import isMongoId from 'validator/lib/isMongoId';

// Validates redeemableID param
export let validateID = (req: Request, res: Response, next: NextFunction) => {
    // Error when not valid
    if (!isMongoId(req.params.redeemableID)) {
        const err = new Error('Redeemable ID is not valid');
        err.status = 404;
        return next(err);
    }
    next();
};
