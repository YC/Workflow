// Add rep for active teams/members
// Refererence:
// https://docs.mongodb.com/manual/reference/method/Bulk.find.update/
// http://codingmiles.com/nodejs-bulk-update-to-mongodb-using-mongoose/

import Member from '../models/member';
import Team from '../models/team';

// Credit rep to all active members
export let creditMemberRep = async (amount: number) => {
    // Use bulk operations to increase rep for each active member
    const bulk = Member.collection.initializeUnorderedBulkOp();
    bulk.find({ active: true }).update({ $inc: { rep: amount } });
    await bulk.execute();
};

// Credit rep to all active teams
export let creditTeamRep = async (amount: number) => {
    // Use bulk operations to increase rep for each active team
    const bulk = Team.collection.initializeUnorderedBulkOp();
    bulk.find({ active: true }).update({ $inc: { rep: amount } });
    await bulk.execute();
};
