import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import Member from '../../models/member';

// Transfers rep from one member to another
export let transferRep = async (
    senderID: string,
    receiverID: string,
    amount: number
) => {
    // Get rep fields of both sender and receiver
    const sender = await Member.findById(senderID, 'rep');
    const receiver = await Member.findById(receiverID, 'rep');

    // Ensure that sender/receiver exists
    if (!sender || !receiver) {
        const err = new Error('Member rep could not be retrieved');
        err.status = 404;
        throw err;
    }
    // Ensure that sender is able to transfer the specified amount of rep
    if (sender.rep - amount < 0) {
        const err = new Error('Sender has inadequate rep');
        err.status = 400;
        throw err;
    }

    // Transfer and save
    sender.rep -= amount;
    receiver.rep += amount;
    await sender.save();
    await receiver.save();
    return true;
};

// Reduces the rep of the specified member by the given amount
export let reduceRep = async (memberID: string, amount: number) => {
    // Get rep field of member
    const member = await Member.findById(memberID, 'rep');

    // Ensure that member has an adequate amount of rep
    if (member.rep - amount < 0) {
        const err = new Error('Member has inadequate rep');
        err.status = 400;
        throw err;
    }

    // Reduce and save
    member.rep -= amount;
    await member.save();
    return true;
};

// Adds the specified amount of rep to a member
export let addRep = async (memberID: string, amount: number) => {
    // Get rep field of member
    const member = await Member.findById(memberID, 'rep');

    // Add rep and save
    member.rep += amount;
    await member.save();
    return true;
};
