import chai from 'chai';
const expect = chai.expect;
import app from '../../index';
import * as Member from '../common/member';

// Test badge award functionality
describe('Team - Award Badge', function() {
    // Agent for admin
    const adminAgent = chai.request.agent(app);
    // Agent for manager
    const managerAgent = chai.request.agent(app);

    // ID of manager
    let managerID: string;
    // ID of member
    let memberID: string;
    // ID of team
    let teamID: string;
    // ID of badge
    let badgeID: string;

    before(async function() {
        // Login as admin
        const adminRes = await adminAgent
            .post('/api/user/login')
            .send({ username: 'admin', password: 'admin' });
        expect(adminRes).to.be.json;
        expect(adminRes).to.have.status(200);

        // Create manager and login as manager
        managerID = await Member.createMember('mma', 'mma');
        const managerRes = await managerAgent
            .post('/api/user/login')
            .send({ username: 'mma', password: 'mma' });
        expect(managerRes).to.be.json;
        expect(managerRes).to.have.status(200);

        // Create team
        const teamRes = await adminAgent
            .post('/api/teams')
            .send({ name: 'Team Award Test', shortName: 'ta' });
        expect(teamRes).to.be.json;
        expect(teamRes).to.have.status(200);
        teamID = teamRes.body.id;

        // Create member
        memberID = await Member.createMember('mmm', 'mmm');

        // Add manager to team
        const managerAddRes = await adminAgent
            .post('/api/teams/' + teamID + '/members/add')
            .send({ memberID: managerID, type: 'manager' });
        expect(managerAddRes).to.be.json;
        expect(managerAddRes).to.have.status(200);
        // Add member to team
        const memberAddRes = await managerAgent
            .post('/api/teams/' + teamID + '/members/add')
            .send({ memberID: memberID, type: 'member' });
        expect(memberAddRes).to.be.json;
        expect(memberAddRes).to.have.status(200);

        // Add a badge
        const badgeRes = await adminAgent
            .post('/api/badges')
            .send({ name: 'Team Badge', description: 'Team Testing Badge' });
        expect(badgeRes).to.be.json;
        expect(badgeRes).to.have.status(200);
        badgeID = badgeRes.body.id;
    });

    // Attempt to award a badge with insufficient rep
    it('/api/teams/:teamID/award/badge - POST - invalid rep', async function() {
        const res = await managerAgent
            .post('/api/teams/' + teamID + '/award/badge')
            .send({ memberID: memberID, rep: 3, badgeID: badgeID });
        expect(res).to.be.json;
        expect(res).to.have.status(400);
    });

    // Award a badge with 0 rep
    it('/api/teams/:teamID/award/badge - POST', async function() {
        const res = await managerAgent
            .post('/api/teams/' + teamID + '/award/badge')
            .send({ memberID: memberID, rep: 0, badgeID: badgeID });
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        const postRes = await managerAgent.get(
            '/api/teams/' + teamID + '/posts'
        );
        expect(postRes.body.posts).to.have.lengthOf(1);
    });
});
