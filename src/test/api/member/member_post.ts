import chai from 'chai';
const expect = chai.expect;
import app from '../../index';
import * as Member from '../common/member';
import * as MemberActionController from '../../../controllers/member/member_rep';

// Member posts
describe('Member - Posts', function() {
    // Agent for user
    const userAgent = chai.request.agent(app);

    // ID of user
    let userID: string;
    // ID of post
    let postID: string;
    // ID of member
    let memberID: string;

    before(async function() {
        // Create member and login as member
        userID = await Member.createMember('mpp', 'mpp');
        const res = await userAgent
            .post('/api/user/login')
            .send({ username: 'mpp', password: 'mpp' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        // Create another member - we'll write on feed of this member
        memberID = await Member.createMember('mpr', 'mpr');

        // Add some rep to the user
        await MemberActionController.addRep(userID, 3);
    });

    // Attempt to post to member feed without rep
    it('/api/members/:memberID/posts - POST without rep', async function() {
        const res = await userAgent
            .post('/api/members/' + memberID + '/posts')
            .send({ message: 'Hello World' });
        expect(res).to.be.json;
        expect(res).to.have.status(400);
    });

    // Post to member feed with rep
    it('/api/members/:memberID/posts - POST with rep', async function() {
        const res = await userAgent
            .post('/api/members/' + memberID + '/posts')
            .send({ message: 'Hello World', rep: 3 });
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        postID = res.body.id;
    });

    // Get posts of test member
    it('/api/members/:memberID/posts - GET', async function() {
        const res = await userAgent.get('/api/members/' + memberID + '/posts');
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body.posts).to.have.lengthOf(1);

        const post = res.body.posts[0];
        expect(post).to.have.property('id');
        expect(post.parentID).to.equal(memberID);
        expect(post.memberID).to.equal(userID);
        expect(post.message).to.equal('Hello World');
        expect(post.rep).to.equal(3);
    });

    // Add a post to test member's feed
    it('/api/members/:memberID/posts/:postID - POST', async function() {
        const res = await userAgent
            .post('/api/members/' + memberID + '/posts/' + postID)
            .send({ message: 'A comment?' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        const comment = res.body.comments[0];
        expect(comment.message).to.equal('A comment?');
        expect(comment.memberID).to.equal(userID);

        const postRes = await userAgent.get(
            '/api/members/' + memberID + '/posts'
        );
        expect(postRes).to.be.json;
        expect(postRes).to.have.status(200);
        expect(postRes.body.posts).to.have.lengthOf(1);
        expect(postRes.body.posts[0].comments).to.have.lengthOf(1);
    });

    // Upvote added post
    it('/api/members/:memberID/posts/:postID/upvote - POST', async function() {
        const res = await userAgent.post(
            '/api/members/' + memberID + '/posts/' + postID + '/upvote'
        );
        expect(res).to.be.json;
        expect(res).to.have.status(200);
    });

    // Attempt to upvote again
    it('/api/members/:memberID/posts/:postID/upvote - POST again', async function() {
        const res = await userAgent.post(
            '/api/members/' + memberID + '/posts/' + postID + '/upvote'
        );
        expect(res).to.be.json;
        expect(res).to.have.status(400);
    });

    // Check that the upvote is there
    it('/api/members/:memberID/posts - GET - check upvote', async function() {
        const res = await userAgent.get('/api/members/' + memberID + '/posts');
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body.posts).to.have.lengthOf(1);

        const post = res.body.posts[0];
        expect(post.upvotes).to.have.lengthOf(1);
        expect(post.upvotes[0]).to.equal(userID);
    });

    // Remove the upvote
    it('/api/members/:memberID/posts/:postID/upvote - DELETE', async function() {
        const res = await userAgent.del(
            '/api/members/' + memberID + '/posts/' + postID + '/upvote'
        );
        expect(res).to.be.json;
        expect(res).to.have.status(200);
    });

    // Attempt to remove the upvote again
    it('/api/members/:memberID/posts/:postID/upvote - DELETE again', async function() {
        const res = await userAgent.del(
            '/api/members/' + memberID + '/posts/' + postID + '/upvote'
        );
        expect(res).to.be.json;
        expect(res).to.have.status(400);
    });

    // Ensure that downvote has been recorded
    it('/api/members/:memberID/posts - GET - check downvote', async function() {
        const res = await userAgent.get('/api/members/' + memberID + '/posts');
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body.posts).to.have.lengthOf(1);

        const post = res.body.posts[0];
        expect(post.upvotes).to.have.lengthOf(0);
    });
});
