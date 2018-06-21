import chai from 'chai';
const expect = chai.expect;
import app from '../../index';

let memberID: string;

// Member registration and approval
describe('Member - Admin', function() {
    const agent = chai.request.agent(app);

    // Authenticate
    before(async function() {
        const res = await agent
            .post('/api/user/login')
            .send({ username: 'admin', password: 'admin' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);
    });

    // Create new member
    it('/user/register - POST - member register', async function() {
        const res = await agent.post('/api/user/register').send({
            firstname: 'Unknown',
            lastname: 'Person',
            username: 'up',
            email: 'a@b',
            password: 'haha',
            type: 'employee'
        });
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        // Get member ID for later tests
        const r = res.body;
        memberID = r._id;

        expect(r).to.have.property('id');
        expect(r.firstname).to.be.equal('Unknown');
        expect(r.lastname).to.be.equal('Person');
        expect(r.username).to.be.equal('up');
        expect(r.type).to.be.equal('employee');
        expect(r).to.not.have.property('password');
    });

    // Approve member
    it('/members/:memberID/approve - POST - member approve', async function() {
        const res = await agent.post('/api/members/' + memberID + '/approve');

        expect(res).to.be.json;
        expect(res).to.have.status(200);

        // Get member ID for later tests
        const r = res.body;

        expect(r).to.have.property('status');
        expect(r.status).to.be.equal('success');
    });
});

// Tests retrieval of member and member badges
describe('Member', function() {
    const agent = chai.request.agent(app);

    // Authenticate
    before(async function() {
        const res = await agent
            .post('/api/user/login')
            .send({ username: 'user', password: 'user' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);
    });

    // Get member
    it('/members/:memberID - GET - get member', async function() {
        const res = await agent.get('/api/members/' + memberID);

        expect(res).to.be.json;
        expect(res).to.have.status(200);

        const r = res.body;
        expect(r).to.have.property('id');
        expect(r.firstname).to.be.equal('Unknown');
        expect(r.lastname).to.be.equal('Person');
        expect(r.username).to.be.equal('up');
        expect(r.type).to.be.equal('employee');
        expect(r).to.not.have.property('posts');
        expect(r).to.not.have.property('password');
        expect(r).to.not.have.property('redeemItems');
    });

    // Get member through primary route
    it('/members?ids= - GET - get members', async function() {
        const res = await agent.get('/api/members?ids=' + memberID);

        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body.members).to.have.lengthOf(1);

        const r = res.body.members[0];
        expect(r).to.have.property('id');
        expect(r.firstname).to.be.equal('Unknown');
        expect(r.lastname).to.be.equal('Person');
        expect(r.username).to.be.equal('up');
        expect(r.type).to.be.equal('employee');
        expect(r).to.not.have.property('posts');
        expect(r).to.not.have.property('password');
        expect(r).to.not.have.property('redeemItems');
    });

    // Get member/invalid
    it('/members/:memberID - GET - get member/invalid', async function() {
        const res = await agent.get('/api/members/haha');
        expect(res).to.be.json;
        expect(res).to.have.status(404);
    });

    // Get members/invalid
    it('/members/:memberID - GET - get members/invalid', async function() {
        const res = await agent.get('/api/members?ids=haha');
        expect(res).to.be.json;
        expect(res).to.have.status(400);
    });

    // Get member
    it('/members?ids= - GET - get badges', async function() {
        const res = await agent.get('/api/members/' + memberID + '/badges');
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('badges');
    });
});
