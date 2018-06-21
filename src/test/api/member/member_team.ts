import chai from 'chai';
const expect = chai.expect;
import app from '../../index';
import * as Member from '../common/member';

// Tests retrieval of member teams
describe('Member - Get teams of member', function() {
    // Agent for admin
    const adminAgent = chai.request.agent(app);
    // Agent for member
    const memberAgent = chai.request.agent(app);

    // ID of member
    let userID: string;
    // ID of teams
    let teamID: string;
    let team2ID: string;

    before(async function() {
        // Login as admin
        const adminRes = await adminAgent
            .post('/api/user/login')
            .send({ username: 'admin', password: 'admin' });
        expect(adminRes).to.be.json;
        expect(adminRes).to.have.status(200);

        // Create team
        const teamRes = await adminAgent
            .post('/api/teams')
            .send({ name: 'Member Team Test 1', shortName: 'mteamg1' });
        expect(teamRes).to.be.json;
        expect(teamRes).to.have.status(200);
        teamID = teamRes.body.id;

        // Create team
        const team2Res = await adminAgent
            .post('/api/teams')
            .send({ name: 'Member Team Test 2', shortName: 'mteamg2' });
        expect(team2Res).to.be.json;
        expect(team2Res).to.have.status(200);
        team2ID = team2Res.body.id;

        // Create user
        userID = await Member.createMember('memteam', 'mmm');

        // Add user to team 1 as member
        const memberAddRes = await adminAgent
            .post('/api/teams/' + teamID + '/members/add')
            .send({ memberID: userID, type: 'member' });
        expect(memberAddRes).to.be.json;
        expect(memberAddRes).to.have.status(200);

        // Add member to team
        const memberAddRes2 = await adminAgent
            .post('/api/teams/' + team2ID + '/members/add')
            .send({ memberID: userID, type: 'manager' });
        expect(memberAddRes2).to.be.json;
        expect(memberAddRes2).to.have.status(200);

        // Login as member
        const memberLoginRes = await memberAgent
            .post('/api/user/login')
            .send({ username: 'memteam', password: 'mmm' });
        expect(memberLoginRes).to.be.json;
        expect(memberLoginRes).to.have.status(200);
    });

    // Get teams of specified member
    it('/api/members/:memberID/teams - GET', async function() {
        const res = await memberAgent.get('/api/members/' + userID + '/teams');
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        // Ensure that 2 teams are returned and returned teams are different
        expect(res.body.teams).to.have.lengthOf(2);
        expect(res.body.teams[0].id).to.not.equal(res.body.teams[1].id);
    });
});
