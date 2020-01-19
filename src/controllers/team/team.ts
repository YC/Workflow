import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

// Import models/controllers
import Team from '../../models/team';
import Member from '../../models/member';
import BadgeItem from '../../models/badgeitem';
import Badge from '../../models/badge';
import * as PostController from '../post';
import { checkMember } from '../../middleware/team';
import { processAvatar } from '../../helper/avatar_upload';
import ErrorStatus from '../../helper/error';

// Creates a team
export let createTeam = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract info from request
    const name: string = req.body.name;
    const shortName: string = req.body.shortName;

    try {
        // Create team and return
        const team = new Team({ name: name, shortName: shortName });
        try {
            await team.save();
        } catch (err) {
            err.status = 422;
            throw err;
        }
        res.json(team.toJSON());
    } catch (err) {
        next(err);
    }
};

// Retrieves a team (without posts or threads)
export let getTeam = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract teamID from param
    const teamID: string = req.params.teamID;

    try {
        // Retrieve and return team
        const team = await Team.findById(teamID, { posts: 0, threads: 0 });
        if (!team) {
            const err: Error = new ErrorStatus('Cannot find team', 404);
            throw err;
        }

        res.json(team.toJSON());
    } catch (err) {
        next(err);
    }
};

// Retrieves multiple specified teams (without posts or threads)
export let getTeams = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Get mongoose query parameters
    const filter: any = req.filter;
    const options: any = req.options;

    try {
        // Query for teams
        const teams = await Team.find(
            filter,
            { posts: 0, threads: 0 },
            options
        );

        // Get total number of matching teams with filter and set header
        const total: number = await Team.countDocuments(filter);
        res.set('Content-Range', 'bytes */' + total);

        // If user is not admin, check for membership
        if (!req.user.scope.includes('admin')) {
            for (const team of teams) {
                // If user is not member or manager of requested team
                if (!checkMember(req.user, team)) {
                    const err = new ErrorStatus(
                        'User is not member of team',
                        403
                    );
                    throw err;
                }
            }
        }

        // Return response
        res.json({ teams: teams.map(team => team.toJSON()) });
    } catch (err) {
        next(err);
    }
};

// Updates the specified team
export let updateTeam = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract ID of specified team
    const teamID: string = req.params.teamID;

    // Set changed content
    let content: any = {};
    // Set name field
    if (req.body.name) {
        content.name = req.body.name;
    }
    // Set shortName field
    if (req.body.shortName) {
        content.shortName = req.body.shortName;
    }
    // Allow admin to change every field
    if (req.user.scope.includes('admin')) {
        content = req.body;
    }

    try {
        // Update the team
        const team = await Team.findByIdAndUpdate(
            teamID,
            { $set: content },
            { new: true, runValidators: true }
        ).select({ posts: 0, threads: 0 });
        if (!team) {
            const err: Error = new ErrorStatus('Team not found', 404);
            throw err;
        }

        // Return the updated team
        res.json(team.toJSON());
    } catch (err) {
        next(err);
    }
};

// Updates the avatar of the specified team
export let updateTeamAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract ID from request
    const id: string = req.params.teamID;

    try {
        if (req.file) {
            // Process the avatar and get the filename
            const filename: string = await processAvatar(req.file);

            // Update the team and return it
            const team = await Team.findByIdAndUpdate(
                id,
                { avatar: filename },
                { new: true, runValidators: true, upsert: true }
            ).select({ posts: 0, threads: 0 });
            res.json(team);
        } else {
            const err: Error = new ErrorStatus('Missing file payload', 422);
            throw err;
        }
    } catch (err) {
        next(err);
    }
};

// Adds the specified member to the team
export let addMember = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract teamID and info from request
    const teamID: string = req.params.teamID;
    const memberID: string = req.body.memberID;
    const type: string = req.body.type;
    // Get the partially retrieved team from req
    const team = req.team;

    try {
        if (type === 'member') {
            // If the member is not already a member of the team
            if (
                !team.members.some(
                    (id: mongoose.Types.ObjectId) => id.toString() === memberID
                )
            ) {
                // Update and return success status
                await Team.findByIdAndUpdate(teamID, {
                    $push: { members: memberID }
                });
                return res.json({ status: 'success' });
            }
        } else if (type === 'manager') {
            // If the member is not already a manager of the team
            if (
                !team.managers.some(
                    (id: mongoose.Types.ObjectId) => id.toString() === memberID
                )
            ) {
                // Update and return success status
                await Team.findByIdAndUpdate(teamID, {
                    $push: { managers: memberID }
                });
                return res.json({ status: 'success' });
            }
        } else {
            const err: Error = new ErrorStatus('Type is invalid', 400);
            throw err;
        }

        // Member/manager has already been added
        const err: Error = new ErrorStatus(
            'Member has already been added to team',
            400
        );
        throw err;
    } catch (err) {
        next(err);
    }
};

// Remove a member
export let removeMember = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract teamID and info from request
    const teamID: string = req.params.teamID;
    const memberID: string = req.body.memberID;
    const type: string = req.body.type;
    // Get the partially retrieved team from req
    const team = req.team;

    try {
        if (type === 'member') {
            // If the member is a member of the team
            if (
                team.members.some(
                    (id: mongoose.Types.ObjectId) => id.toString() === memberID
                )
            ) {
                // Update and return success status
                await Team.findByIdAndUpdate(teamID, {
                    $pull: { members: memberID }
                });
                return res.json({ status: 'success' });
            }
        } else if (type === 'manager') {
            // If the member is a manager of the team
            if (
                team.managers.some(
                    (id: mongoose.Types.ObjectId) => id.toString() === memberID
                )
            ) {
                // Update and return success status
                await Team.findByIdAndUpdate(teamID, {
                    $pull: { managers: memberID }
                });
                return res.json({ status: 'success' });
            }
        }

        // Specified member is not a member/manager of the team
        const err = new ErrorStatus(
            'Member is not member or manager of team',
            400
        );
        throw err;
    } catch (err) {
        next(err);
    }
};

// Awards a badge to the specified member
export let awardBadge = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract params/options
    const teamID: string = req.params.teamID;
    const receiverID: string = req.body.memberID;
    const badgeID: string = req.body.badgeID;

    try {
        // Cast rep into number
        const rep: number = Number(req.body.rep);

        // Get the team and the rep of the team
        const team = await Team.findById(teamID, 'rep');
        if (!team) {
            const err = new ErrorStatus('Team could not be retrieved', 404);
            throw err;
        }

        // Ensure that member is in team
        const members: mongoose.Types.ObjectId[] = req.team.members;
        // If member is not in team
        if (
            !req.team.managers.some(
                (memberID: mongoose.Types.ObjectId) =>
                    memberID.toString() === receiverID
            ) &&
            !req.team.members.some(
                (memberID: mongoose.Types.ObjectId) =>
                    memberID.toString() === receiverID
            )
        ) {
            const err = new ErrorStatus('Member not in team', 400);
            throw err;
        }

        // Create badge item
        const badgeItem = new BadgeItem({
            badgeID: badgeID,
            awarderID: req.user.id,
            teamID: teamID
        });
        // Ensure that badge exists
        const badge = await Badge.findById(badgeID);
        if (!badge) {
            const err: Error = new ErrorStatus('Badge does not exist', 400);
            throw err;
        }

        // If rep is insufficient
        if (team.rep - Number(rep) < 0) {
            const err: Error = new ErrorStatus('Rep is insufficient', 400);
            throw err;
        }

        // Add the badge and rep
        const member = await Member.findById(
            receiverID,
            'firstname lastname badges rep'
        );
        member.badges.push(badgeItem);
        member.rep += rep;
        // Reduce team rep
        team.rep -= rep;

        // Add team post to announce that badge has been awarded
        const memberName: string = member.firstname + ' ' + member.lastname;
        const message: string =
            memberName + ' has been awarded the ' + badge.name + ' badge.';
        await PostController.createPost(
            teamID,
            receiverID,
            undefined,
            message,
            rep
        );

        // Save the member and the team
        await member.save();
        await team.save();
        res.json({ status: 'success' });
    } catch (err) {
        next(err);
    }
};
