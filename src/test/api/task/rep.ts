import chai from 'chai';
const expect = chai.expect;
import app from '../../index';
import { creditTeamRep, creditMemberRep } from '../../../helper/rep';
import Member from '../../../models/member';
import Team from '../../../models/team';

// Test adding of rep
describe('Bulk add rep', function() {
    // Test bulk add of team rep
    it('Add team rep', async function() {
        // Get reps of teams before update
        const teamBefore = await Team.find({ active: true });
        const teamRepBefore: any = {};
        for (const team of teamBefore) {
            teamRepBefore[team.id] = team.rep;
        }

        // Add rep to every active team
        await creditTeamRep(20);

        // Match rep of teams after update
        const teamAfter = await Team.find({ active: true });
        expect(teamAfter).to.be.not.empty;
        for (const team of teamAfter) {
            expect(team.rep).to.equal(teamRepBefore[team.id] + 20);
        }
    });

    // Test bulk add of member rep
    it('Add member rep', async function() {
        // Get reps of members before update
        const memberBefore = await Member.find({ active: true });
        const memberRepBefore: any = {};
        for (const member of memberBefore) {
            memberRepBefore[member.id] = member.rep;
        }

        // Add rep to every active team
        await creditMemberRep(20);

        // Match rep of teams after update
        const memberAfter = await Member.find({ active: true });
        for (const member of memberAfter) {
            expect(member.rep).to.equal(memberRepBefore[member.id] + 20);
        }
    });
});
