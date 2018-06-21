import chai from 'chai';
const expect = chai.expect;
import app from '../../index';

let teamID: string;

// Creation, retrieval and modification of teams
describe('Team - Admin', function() {
    const agent = chai.request.agent(app);

    // Authenticate
    before(async function() {
        const res = await agent
            .post('/api/user/login')
            .send({ username: 'admin', password: 'admin' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);
    });

    // Create new team
    it('/team - POST - create team', async function() {
        const res = await agent
            .post('/api/teams')
            .send({ name: 'Test Team', shortName: 'test' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        // Get badge ID for later tests
        const r = res.body;
        expect(r).to.have.property('id');
        teamID = r.id;

        expect(r.name).to.be.equal('Test Team');
        expect(r.shortName).to.be.equal('test');
        expect(r).to.have.property('members');
        expect(r).to.have.property('managers');
        expect(r).to.have.property('posts');
        expect(r).to.have.property('threads');
    });

    // Attempt to create team with same shortname
    it('/team - POST - create team with same shortName', async function() {
        const res = await agent
            .post('/api/teams')
            .send({ name: 'Test Team 2', shortName: 'test' });
        expect(res).to.have.status(422);
    });

    // Get all teams
    it('/team - GET - get all teams', async function() {
        const res = await agent.get('/api/teams');
        expect(res).to.have.status(200);

        const r = res.body.teams;
        expect(r[0].id).to.be.equal(teamID);
        expect(r[0].name).to.be.equal('Test Team');
        expect(r[0].shortName).to.be.equal('test');
        expect(r[0]).to.have.property('members');
        expect(r[0]).to.have.property('managers');
        expect(r[0]).to.not.have.property('posts');
        expect(r[0]).to.not.have.property('threads');
    });

    // Update team
    it('/teams/:teamID - PUT - update team', async function() {
        const res = await agent
            .put('/api/teams/' + teamID)
            .send({ name: 'Test Team Revised', shortName: 'a' });
        expect(res).to.have.status(200);

        const r = res.body;
        expect(r.id).to.be.equal(teamID);
        expect(r.name).to.be.equal('Test Team Revised');
        expect(r.shortName).to.be.equal('a');
        expect(r).to.have.property('members');
        expect(r).to.have.property('managers');
        expect(r).to.not.have.property('posts');
        expect(r).to.not.have.property('threads');
    });
});

// Tests addition and removal of team member and managers
describe('Team - Member adding', function() {
    // Agents
    const adminAgent = chai.request.agent(app);
    const managerAgent = chai.request.agent(app);
    const userAgent = chai.request.agent(app);

    // Manager/User
    let managerID: string;
    let userID: string;

    before(async function() {
        const res = await adminAgent
            .post('/api/user/login')
            .send({ username: 'admin', password: 'admin' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        // Create an team manager
        const resManager = await managerAgent.post('/api/user/register').send({
            firstname: 'Team',
            lastname: 'Manager',
            username: 'manager',
            email: 'a@b',
            password: 'manager',
            type: 'employee'
        });
        expect(resManager).to.be.json;
        expect(resManager).to.have.status(200);
        const resManagerApprove = await adminAgent.post(
            '/api/members/' + resManager.body.id + '/approve'
        );
        expect(resManagerApprove).to.be.json;
        expect(resManagerApprove).to.have.status(200);

        const res2 = await managerAgent
            .post('/api/user/login')
            .send({ username: 'manager', password: 'manager' });
        managerID = res2.body.id;
        expect(res2).to.be.json;
        expect(res2).to.have.status(200);

        const res3 = await userAgent
            .post('/api/user/login')
            .send({ username: 'user', password: 'user' });
        userID = res3.body.id;
        expect(res3).to.be.json;
        expect(res3).to.have.status(200);
    });

    // Attempt to add manager without proper credentials
    it('Try to add manager without being manager', async function() {
        const res = await managerAgent
            .post('/api/teams/' + teamID + '/members/add')
            .send({ memberID: managerID, type: 'manager' });
        expect(res).to.be.json;
        expect(res).to.have.status(403);
    });

    // Add manager as admin
    it('Add manager as admin', async function() {
        const res = await adminAgent
            .post('/api/teams/' + teamID + '/members/add')
            .send({ memberID: managerID, type: 'manager' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        const r = await adminAgent.get('/api/teams/' + teamID);
        expect(r).to.have.status(200);
        expect(r.body.managers[0] === managerID).to.equal(true);
    });

    // Add member as manager
    it('Add member as manager', async function() {
        const res = await managerAgent
            .post('/api/teams/' + teamID + '/members/add')
            .send({ memberID: userID, type: 'member' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        const r = await adminAgent.get('/api/teams/' + teamID);
        expect(r).to.have.status(200);
        expect(r.body.members[0] === userID).to.equal(true);
    });

    // Attempt to add member again
    it('Add member as manager again', async function() {
        const res = await managerAgent
            .post('/api/teams/' + teamID + '/members/add')
            .send({ memberID: userID, type: 'member' });
        expect(res).to.be.json;
        expect(res).to.have.status(400);
    });

    // Remove member
    it('Remove member as manager', async function() {
        const res = await managerAgent
            .post('/api/teams/' + teamID + '/members/remove')
            .send({ memberID: userID, type: 'member' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        const r = await managerAgent.get('/api/teams/' + teamID);
        expect(r).to.have.status(200);
        expect(r.body.members).to.have.lengthOf(0);
    });

    // Attempt to remove same member (which was already removed)
    it('Remove invalid member', async function() {
        // Try to remove member again
        const r = await managerAgent
            .post('/api/teams/' + teamID + '/members/remove')
            .send({ memberID: userID, type: 'member' });
        expect(r).to.be.json;
        expect(r).to.have.status(400);
    });

    // Add a member for further team tests
    it('Add member for coming tests', async function() {
        const res = await managerAgent
            .post('/api/teams/' + teamID + '/members/add')
            .send({ memberID: userID, type: 'member' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);
    });
});

// Test user retrieval of teams
describe('Team - Get', function() {
    const agent = chai.request.agent(app);

    // Authenticate
    before(async function() {
        const res = await agent
            .post('/api/user/login')
            .send({ username: 'user', password: 'user' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);
    });

    // Get team
    it('/teams/:teamID - GET - get team', async function() {
        const res = await agent.get('/api/teams/' + teamID);
        expect(res).to.have.status(200);

        const r = res.body;
        expect(r).to.have.property('id');
        expect(r.name).to.be.equal('Test Team Revised');
        expect(r.shortName).to.be.equal('a');
        expect(r).to.have.property('members');
        expect(r).to.have.property('managers');
        expect(r).to.not.have.property('posts');
        expect(r).to.not.have.property('threads');
    });

    // Get teams
    it('/teams/teams - GET - get teams', async function() {
        const res = await agent.get('/api/teams?ids=' + teamID);
        expect(res).to.have.status(200);

        const r = res.body.teams[0];
        expect(r.id).to.be.equal(teamID);
        expect(r.name).to.be.equal('Test Team Revised');
        expect(r.shortName).to.be.equal('a');
        expect(r).to.have.property('members');
        expect(r).to.have.property('managers');
        expect(r).to.not.have.property('posts');
        expect(r).to.not.have.property('threads');
    });
});
