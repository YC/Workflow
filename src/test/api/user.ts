import chai from 'chai';
const expect = chai.expect;
import app from '../index';

import * as Member from '../../controllers/member/member';
let memberID: string;

// Tests user registration, login, logout, retrieval of redeems and session
describe('User', function() {
    const agent = chai.request.agent(app);
    const adminAgent = chai.request.agent(app);

    // Make admin
    it('Create admin user and log in', async function() {
        // Create an admin member
        const res = await adminAgent.post('/api/user/register').send({
            firstname: 'Admin',
            lastname: 'Admin',
            username: 'admin',
            email: 'a@b',
            password: 'admin',
            type: 'employee'
        });
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        await Member.makeAdmin(res.body.id);

        // Login as admin
        await adminAgent.post('/api/user/login').send({
            username: 'admin',
            password: 'admin'
        });
    });

    // Create new members
    it('/user/register - POST - member register', async function() {
        const res = await agent.post('/api/user/register').send({
            firstname: 'A',
            lastname: 'User',
            username: 'user',
            email: 'a@b',
            password: 'user',
            type: 'employee'
        });
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        // Get member ID for later tests
        const r = res.body;
        memberID = r._id;

        expect(r).to.have.property('id');
        expect(r.firstname).to.be.equal('A');
        expect(r.lastname).to.be.equal('User');
        expect(r.username).to.be.equal('user');
        expect(r.type).to.be.equal('employee');
        expect(r).to.not.have.property('password');
    });

    // Approve
    it('/user/member/:memberID/approve as admin', async function() {
        const res = await adminAgent.post(
            '/api/members/' + memberID + '/approve'
        );
        expect(res).to.be.json;
        expect(res).to.have.status(200);
    });

    // Login
    it('/user/login', async function() {
        const res = await agent.post('/api/user/login').send({
            username: 'user',
            password: 'user'
        });
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        const r = res.body;
        expect(r).to.have.property('id');
    });

    // Get session
    it('/user/session', async function() {
        const res = await agent.get('/api/user/session');
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        const r = res.body;
        expect(r).to.have.property('id');
        expect(r).to.not.have.property('password');
    });

    // Get redeems
    it('/user/redeems', async function() {
        const res = await agent.get('/api/user/redeems');
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        const r = res.body;
        expect(r).to.have.property('id');
        expect(r).to.have.property('redeemItems');
    });

    // Logout
    it('/user/logout', async function() {
        const res = await agent.get('/api/user/logout');
        expect(res).to.be.json;
        expect(res).to.have.status(200);
    });
});
