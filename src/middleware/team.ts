import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import Team from '../models/team';
import ErrorStatus from '../helper/error';
import '../types/request';

// Retrieves the team
export let getTeamMembers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract teamID
    const teamID = req.params.teamID;

    // Error if parameters/query is missing
    if (!teamID) {
        const err = new ErrorStatus(
            'Required parameters/queries are missing',
            400
        );
        return next(err);
    }

    // Get and set the team
    const team = await Team.findById(teamID, 'members managers active');
    if (!team) {
        const err = new ErrorStatus('Team not found', 404);
        return next(err);
    }

    req.team = team;
    return next();
};

// Ensure that user is manager
export let isManager = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Check whether user is manager of team
    if (await checkManager(req.user, req.team)) {
        // If user is manager
        return next();
    } else {
        // If user is not manager
        const err = new ErrorStatus(
            'User is not a manager of team ' + req.team.id,
            403
        );
        return next(err);
    }
};

// Returns boolean value indicating whether the specified user is a manager
// of the specified team
const checkManager = async (user: any, team: any) => {
    // If user is admin
    if (user.scope.includes('admin')) {
        return true;
    }

    // If user is a manager
    // Adapted from https://stackoverflow.com/questions/19737408
    if (
        team.managers.some((memberID: mongoose.Types.ObjectId) =>
            memberID.equals(user.id)
        )
    ) {
        return true;
    }
    return false;
};

// Ensure that user is manager
export let isMember = async function(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Check whether user is member of team
    if (await checkMember(req.user, req.team)) {
        // If user is member
        return next();
    } else {
        // If user is not member
        const err = new ErrorStatus(
            'User is not a member of team ' + req.team.id,
            403
        );
        return next(err);
    }
};

// Returns boolean value indicating whether the specified user is a member
// of the specified team
export let checkMember = async (user: any, team: any) => {
    // If user is admin
    if (user.scope.includes('admin')) {
        return true;
    }

    // If the user is a member or manager, then user is member of the team
    if (
        team.managers.some((memberID: mongoose.Types.ObjectId) =>
            memberID.equals(user.id)
        ) ||
        team.members.some((memberID: mongoose.Types.ObjectId) =>
            memberID.equals(user.id)
        )
    ) {
        return true;
    }
    return false;
};
