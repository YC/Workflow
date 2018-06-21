import chai from 'chai';
const expect = chai.expect;
import app from '../../index';
import * as Member from '../common/member';

// Tests search functionality
describe('Search', function() {
    // Agent for admin
    const adminAgent = chai.request.agent(app);
    // Agent for member
    const memberAgent = chai.request.agent(app);

    // Authenticate
    before(async function() {
        const resAdminLogin = await adminAgent
            .post('/api/user/login')
            .send({ username: 'admin', password: 'admin' });
        expect(resAdminLogin).to.be.json;
        expect(resAdminLogin).to.have.status(200);

        // Create and login as member
        await Member.createMember('msearch', 'msearch');
        const resMemberLogin = await memberAgent
            .post('/api/user/login')
            .send({ username: 'msearch', password: 'msearch' });
        expect(resMemberLogin).to.be.json;
        expect(resMemberLogin).to.have.status(200);

        // Create a team
        const resTeamCreate = await adminAgent
            .post('/api/teams')
            .send({ name: 'Search Team', shortName: 'searchteam' });
        expect(resTeamCreate).to.be.json;
        expect(resTeamCreate).to.have.status(200);
        const teamID = resTeamCreate.body.id;

        // Add the member
        const resTeamAddMember = await adminAgent
            .post('/api/teams/' + teamID + '/members/add')
            .send({ memberID: resMemberLogin.body.id, type: 'manager' });
        expect(resTeamAddMember).to.be.json;
        expect(resTeamAddMember).to.have.status(200);

        // Add a post
        const res = await adminAgent
            .post('/api/teams/' + teamID + '/posts')
            .send({ message: 'Hello World' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);
    });

    // Search for member name
    it('Member', async function() {
        const res = await memberAgent.get('/api/search?q=Admin');
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('members');
        expect(res.body.members).to.not.be.empty;
    });

    // Search for team post
    it('Team', async function() {
        const res = await memberAgent.get('/api/search?q=world');
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('posts');
        expect(res.body.posts).to.not.be.empty;
    });
});
