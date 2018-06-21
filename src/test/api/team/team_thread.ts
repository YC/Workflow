import chai from 'chai';
const expect = chai.expect;
import app from '../../index';
import * as Member from '../common/member';

// Team threads
describe('Team - Threads', function() {
    // Agent for admin
    const adminAgent = chai.request.agent(app);
    // Agent for user
    const userAgent = chai.request.agent(app);

    // ID of member
    let memberID: string;
    // ID of thread
    let threadID: string;
    // ID of team
    let teamID: string;

    before(async function() {
        // Login as admin
        const adminRes = await adminAgent
            .post('/api/user/login')
            .send({ username: 'admin', password: 'admin' });
        expect(adminRes).to.be.json;
        expect(adminRes).to.have.status(200);

        // Create member and login as member
        memberID = await Member.createMember('mtthread', 'mtthread');
        const res = await userAgent
            .post('/api/user/login')
            .send({ username: 'mtthread', password: 'mtthread' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        // Create team
        const teamRes = await adminAgent
            .post('/api/teams')
            .send({ name: 'Post Thread Team', shortName: 'ptthread' });
        expect(teamRes).to.be.json;
        expect(teamRes).to.have.status(200);
        teamID = teamRes.body.id;

        // Add member to team
        const memAddRes = await adminAgent
            .post('/api/teams/' + teamID + '/members/add')
            .send({ memberID: memberID, type: 'member' });
        expect(memAddRes).to.be.json;
        expect(memAddRes).to.have.status(200);
    });

    // Add a team thread
    it('/api/teams/:teamID/threads - POST', async function() {
        const res = await userAgent
            .post('/api/teams/' + teamID + '/threads')
            .send({ title: 'Hello' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);
    });

    // Get all team threads
    it('/api/teams/:teamID/threads - GET', async function() {
        const res = await userAgent.get('/api/teams/' + teamID + '/threads');
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body.threads).to.have.lengthOf(1);

        const thread = res.body.threads[0];
        expect(thread).to.have.property('id');
        threadID = thread.id;
        expect(thread.parentID).to.equal(teamID);
        expect(thread.memberID).to.equal(memberID);
        expect(thread.title).to.equal('Hello');
    });

    // Add a comment to the team thread
    it('/api/teams/:teamID/threads/:threadID - POST', async function() {
        const res = await userAgent
            .post('/api/teams/' + teamID + '/threads/' + threadID)
            .send({ message: 'A comment?' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        const comment = res.body.comments[0];
        expect(comment.message).to.equal('A comment?');
        expect(comment.memberID).to.equal(memberID);

        const threadRes = await userAgent.get(
            '/api/teams/' + teamID + '/threads'
        );
        expect(threadRes).to.be.json;
        expect(threadRes).to.have.status(200);
        expect(threadRes.body.threads).to.have.lengthOf(1);
        expect(threadRes.body.threads[0].comments).to.have.lengthOf(1);
    });

    // Upvote the thread
    it('/api/teams/:teamID/threads/:threadID/upvote - POST', async function() {
        const res = await userAgent.post(
            '/api/teams/' + teamID + '/threads/' + threadID + '/upvote'
        );
        expect(res).to.be.json;
        expect(res).to.have.status(200);
    });

    // Attempt to upvote the thread again
    it('/api/teams/:teamID/threads/:threadID/upvote - POST again', async function() {
        const res = await userAgent.post(
            '/api/teams/' + teamID + '/threads/' + threadID + '/upvote'
        );
        expect(res).to.be.json;
        expect(res).to.have.status(400);
    });

    // Ensure that upvote has been applied
    it('/api/teams/:teamID/threads - GET - check upvote', async function() {
        const res = await userAgent.get('/api/teams/' + teamID + '/threads');
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body.threads).to.have.lengthOf(1);

        const thread = res.body.threads[0];
        expect(thread.upvotes).to.have.lengthOf(1);
        expect(thread.upvotes[0]).to.equal(memberID);
    });

    // Remove the upvote
    it('/api/teams/:teamID/threads/:threadID/upvote - DELETE', async function() {
        const res = await userAgent.del(
            '/api/teams/' + teamID + '/threads/' + threadID + '/upvote'
        );
        expect(res).to.be.json;
        expect(res).to.have.status(200);
    });

    // Attempt to remove the upvote again
    it('/api/teams/:teamID/threads/:threadID/upvote - DELETE again', async function() {
        const res = await userAgent.del(
            '/api/teams/' + teamID + '/threads/' + threadID + '/upvote'
        );
        expect(res).to.be.json;
        expect(res).to.have.status(400);
    });

    // Ensure that the removal has been applied
    it('/api/teams/:teamID/threads - GET - check downvote', async function() {
        const res = await userAgent.get('/api/teams/' + teamID + '/threads');
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body.threads).to.have.lengthOf(1);

        const thread = res.body.threads[0];
        expect(thread.upvotes).to.have.lengthOf(0);
    });
});
