import chai from 'chai';
const expect = chai.expect;
import app from '../../index';
import * as Member from '../common/member';

// Team news
describe('Team - News', function() {
    // Agent for admin
    const adminAgent = chai.request.agent(app);
    // Agent for manager
    const managerAgent = chai.request.agent(app);

    // ID of manager
    let managerID: string;
    // ID of team
    let teamID: string;

    before(async function() {
        // Login as admin
        const adminRes = await adminAgent
            .post('/api/user/login')
            .send({ username: 'admin', password: 'admin' });
        expect(adminRes).to.be.json;
        expect(adminRes).to.have.status(200);

        // Create manager and login as manager
        managerID = await Member.createMember('team_news', 'team_news');
        const managerRes = await managerAgent
            .post('/api/user/login')
            .send({ username: 'team_news', password: 'team_news' });
        expect(managerRes).to.be.json;
        expect(managerRes).to.have.status(200);

        // Create team
        const teamRes = await adminAgent
            .post('/api/teams')
            .send({ name: 'Team Award Test', shortName: 'tnews' });
        expect(teamRes).to.be.json;
        expect(teamRes).to.have.status(200);
        teamID = teamRes.body.id;

        // Add manager to team
        const managerAddRes = await adminAgent
            .post('/api/teams/' + teamID + '/members/add')
            .send({ memberID: managerID, type: 'manager' });
        expect(managerAddRes).to.be.json;
        expect(managerAddRes).to.have.status(200);
    });

    // Add a team news post
    it('/api/:teamID/news - POST', async function() {
        const res = await managerAgent
            .post('/api/teams/' + teamID + '/news')
            .send({ message: 'hi' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);
    });
});
