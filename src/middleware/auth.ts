import { Request, Response, NextFunction } from 'express';
import ErrorStatus from '../helper/error';

// Ensure that the user is an admin
export let isAdmin = (req: Request, res: Response, next: NextFunction) => {
    // If user is admin, continue
    if (req.user.scope.includes('admin')) {
        return next();
    }

    // If user is not admin
    const err: Error = new ErrorStatus(
        'User is not permitted to perform the requested actions',
        403
    );
    next(err);
};

// Ensure that the user is authenticated
export let isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // If user is authenticated
    if (req.isAuthenticated()) {
        return next();
    }

    // If user is not authenticated
    const err: Error = new ErrorStatus('User is not authenticated', 401);
    return next(err);
};
