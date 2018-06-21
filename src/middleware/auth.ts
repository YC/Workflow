import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

// Ensure that the user is an admin
export let isAdmin = (req: Request, res: Response, next: NextFunction) => {
    // If user is admin, continue
    if (req.user.scope.includes('admin')) {
        return next();
    }

    // If user is not admin
    const err: Error = new Error(
        'User is not permitted to perform the requested actions'
    );
    err.status = 403;
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
    const err: Error = new Error('User is not authenticated');
    err.status = 401;
    return next(err);
};
