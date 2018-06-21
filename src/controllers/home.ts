import { Request, Response, NextFunction } from 'express';

// Controller for index route
export let getIndex = async (req: Request, res: Response) => {
    return res.json({ name: 'Workflow', version: '0.9b' });
};
