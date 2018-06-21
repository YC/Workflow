import { Request, Response, NextFunction } from 'express';
import isMongoId from 'validator/lib/isMongoId';

// Validates redeemItemID param
export let validateID = (req: Request, res: Response, next: NextFunction) => {
    // Error when not valid
    if (!isMongoId(req.params.redeemItemID)) {
        const err = new Error('Redeem item ID is not valid');
        err.status = 404;
        return next(err);
    }
    next();
};
