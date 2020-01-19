import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

// Model imports
import Member from '../../models/member';
import Team from '../../models/team';
import ErrorStatus from '../../helper/error';

// Gives admin scope to member (makes member admin)
export let makeAdmin = async (memberID: string) => {
    // Add admin scope to member
    return await Member.findByIdAndUpdate(memberID, {
        $push: { scope: 'admin' }
    });
};

// Creates a member
export let createMember = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract info from body
    let username: string = req.body.username;
    const firstname: string = req.body.firstname;
    const lastname: string = req.body.lastname;
    const type: string = req.body.type;
    const email: string = req.body.email;
    const password: string = req.body.password;

    // Convert username to lowercase
    if (username) {
        username = username.toLowerCase();
    }

    // Create a member document
    const member = new Member({
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        type: type
    });

    // Add the member (by saving the document)
    try {
        await member.save();
    } catch (err) {
        err.status = 422;
        return next(err);
    }
    // Return the added member
    res.json(member.toJSON());
};

// Activates a member account
export let approveMember = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract the ID from the URL
    const memberID: string = req.params.memberID;

    try {
        // Update and ensure update was successful
        const member = await Member.findByIdAndUpdate(memberID, {
            $set: { active: true }
        });
        if (!member) {
            const err: Error = new ErrorStatus('Member not found', 404);
            throw err;
        }

        // Return success status
        res.json({ status: 'success' });
    } catch (err) {
        next(err);
    }
};

// Gets a member (without posts or redeem items)
export let getMember = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract memberID from param
    const memberID: string = req.params.memberID;

    try {
        // Get specified member
        const member = await Member.findById(memberID, {
            posts: 0,
            redeemItems: 0
        });
        if (!member) {
            const err: Error = new ErrorStatus('Cannot find member', 404);
            throw err;
        }

        // If the user is the member or an admin, keep the rep field
        if (
            req.user.scope.includes('admin') ||
            req.user.id.toString() === memberID
        ) {
            // Override the transform function to include rep
            res.json(
                member.toJSON({
                    transform: function(doc: any, ret: any, options: any) {
                        // Do not return the password hash
                        delete ret.password;
                        return ret;
                    }
                })
            );
        } else {
            // If not, return member without rep
            res.json(member.toJSON());
        }
    } catch (err) {
        next(err);
    }
};

// Retrieves multiple members (without posts)
export let getMembers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Get mongoose query parameters from request
    const filter: any = req.filter;
    const options: any = req.options;

    try {
        // Query for members and return
        const members = await Member.find(
            filter,
            {
                posts: 0,
                redeemItems: 0
            },
            options
        );

        // Get total number of matching members with filter and set header
        const total = await Member.countDocuments(filter);
        res.set('Content-Range', 'bytes */' + total);

        // If the user is an admin, keep the rep field
        if (req.user.scope.includes('admin')) {
            // Override the transform function to include rep
            res.json({
                members: members.map(member =>
                    member.toJSON({
                        transform: function(doc: any, ret: any, options: any) {
                            // Do not return the password hash
                            delete ret.password;
                            return ret;
                        }
                    })
                )
            });
        } else {
            // If not, return members without rep
            res.json({
                members: members.map(member => member.toJSON())
            });
        }
    } catch (err) {
        next(err);
    }
};

// Gets teams of specified member
export let getTeams = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract memberID from params
    const memberID: string = req.params.memberID;

    try {
        let teams;
        if (req.user.scope.includes('admin')) {
            // Return all teams if user is admin
            teams = await Team.find({}, { posts: 0, threads: 0 });
        } else {
            // Get teams for which user is member or manager
            teams = await Team.find(
                {
                    $or: [{ members: memberID }, { managers: memberID }]
                },
                { posts: 0, threads: 0 }
            );
        }

        // Return teams
        res.json({ teams: teams.map(team => team.toJSON()) });
    } catch (err) {
        next(err);
    }
};

// Gets badges of specified member
export let getBadges = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Extract memberID from params
    const memberID: string = req.params.memberID;

    try {
        // Get badges of member
        const member_badges = await Member.findById(memberID, 'id badges');

        // Return badges
        res.json(member_badges.toJSON());
    } catch (err) {
        next(err);
    }
};
