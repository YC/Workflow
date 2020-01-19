import { Request, Response, NextFunction } from 'express';
import ErrorStatus from '../helper/error';
import mongoose from 'mongoose';

/**
 * A middleware for verifying the specified ID param.
 * @param name Name of ID param.
 */
const verifyIDParam = (name: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const param = req.params[name];
        if (!mongoose.Types.ObjectId.isValid(param)) {
            const err = new ErrorStatus('ID is not valid', 400);
            return next(err);
        }
        return next();
    };
};
export default verifyIDParam;
