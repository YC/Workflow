import chai from 'chai';
const expect = chai.expect;
import app from '../../index';
import * as Member from '../common/member';

// Team posts
describe('Team - Posts', function() {
    // Agent for admin
    const adminAgent = chai.request.agent(app);
    // Agent for user
    const userAgent = chai.request.agent(app);

    // ID of member
    let memberID: string;
    // ID of post
    let postID: string;
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
        memberID = await Member.createMember('mtp', 'mtp');
        const res = await userAgent
            .post('/api/user/login')
            .send({ username: 'mtp', password: 'mtp' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        // Create team
        const teamRes = await adminAgent
            .post('/api/teams')
            .send({ name: 'Post Test Team', shortName: 'tp' });
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

    // Add a team post
    it('/api/teams/:teamID/posts - POST', async function() {
        const res = await userAgent
            .post('/api/teams/' + teamID + '/posts')
            .send({ message: 'Hello World' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);
    });

    // Get all team posts
    it('/api/teams/:teamID/posts - GET', async function() {
        const res = await userAgent.get('/api/teams/' + teamID + '/posts');
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body.posts).to.have.lengthOf(1);

        const post = res.body.posts[0];
        expect(post).to.have.property('id');
        postID = post.id;
        expect(post.parentID).to.equal(teamID);
        expect(post.memberID).to.equal(memberID);
        expect(post.message).to.equal('Hello World');
    });

    // Add a comment to the created post
    it('/api/teams/:teamID/posts/:postID - POST', async function() {
        const res = await userAgent
            .post('/api/teams/' + teamID + '/posts/' + postID)
            .send({ message: 'A comment?' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        const comment = res.body.comments[0];
        expect(comment.message).to.equal('A comment?');
        expect(comment.memberID).to.equal(memberID);

        const postRes = await userAgent.get('/api/teams/' + teamID + '/posts');
        expect(postRes).to.be.json;
        expect(postRes).to.have.status(200);
        expect(postRes.body.posts).to.have.lengthOf(1);
        expect(postRes.body.posts[0].comments).to.have.lengthOf(1);
    });

    // Add an upvote to created post
    it('/api/teams/:teamID/posts/:postID/upvote - POST', async function() {
        const res = await userAgent.post(
            '/api/teams/' + teamID + '/posts/' + postID + '/upvote'
        );
        expect(res).to.be.json;
        expect(res).to.have.status(200);
    });

    // Attempt to add the upvote again
    it('/api/teams/:teamID/posts/:postID/upvote - POST again', async function() {
        const res = await userAgent.post(
            '/api/teams/' + teamID + '/posts/' + postID + '/upvote'
        );
        expect(res).to.be.json;
        expect(res).to.have.status(400);
    });

    // Check that the upvote is stored correctly
    it('/api/teams/:teamID/posts - GET - check upvote', async function() {
        const res = await userAgent.get('/api/teams/' + teamID + '/posts');
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body.posts).to.have.lengthOf(1);

        const post = res.body.posts[0];
        expect(post.upvotes).to.have.lengthOf(1);
        expect(post.upvotes[0]).to.equal(memberID);
    });

    // Remove the upvote
    it('/api/teams/:teamID/posts/:postID/upvote - DELETE', async function() {
        const res = await userAgent.del(
            '/api/teams/' + teamID + '/posts/' + postID + '/upvote'
        );
        expect(res).to.be.json;
        expect(res).to.have.status(200);
    });

    // Attempt to remove the upvote again
    it('/api/teams/:teamID/posts/:postID/upvote - DELETE again', async function() {
        const res = await userAgent.del(
            '/api/teams/' + teamID + '/posts/' + postID + '/upvote'
        );
        expect(res).to.be.json;
        expect(res).to.have.status(400);
    });

    // Ensure that downvote has been applied
    it('/api/teams/:teamID/posts - GET - check downvote', async function() {
        const res = await userAgent.get('/api/teams/' + teamID + '/posts');
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body.posts).to.have.lengthOf(1);

        const post = res.body.posts[0];
        expect(post.upvotes).to.have.lengthOf(0);
    });
});
