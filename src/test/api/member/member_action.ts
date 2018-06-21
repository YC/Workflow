import chai from 'chai';
const expect = chai.expect;
import app from '../../index';
import * as Member from '../common/member';
import * as MemberActionController from '../../../controllers/member/member_rep';

// Member updates, redeem actions and redeem item rejection
describe('Member Actions', function() {
    const agent = chai.request.agent(app);
    const adminAgent = chai.request.agent(app);

    // ID of test member
    let memberID: string;
    // ID of test redeemable
    let redeemableID: string;
    // ID of inserted redeemitem
    let redeemItemID: string;

    // Create member and authenticate
    before(async function() {
        // Create and login as member
        memberID = await Member.createMember('ma', 'ma');
        const res = await agent
            .post('/api/user/login')
            .send({ username: 'ma', password: 'ma' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        // Login as admin
        const ar = await adminAgent
            .post('/api/user/login')
            .send({ username: 'admin', password: 'admin' });
        expect(ar).to.be.json;
        expect(ar).to.have.status(200);

        // Create a redeemable
        const r = await adminAgent.post('/api/redeems').send({
            name: 'Test redeemable',
            description: 'Testing redeemable',
            rep: 3
        });
        expect(r).to.be.json;
        expect(r).to.have.status(200);
        redeemableID = r.body.id;
    });

    // Update member
    it('/members/:memberID - PUT - update member', async function() {
        const res = await agent
            .put('/api/members/' + memberID)
            .send({ bio: 'hi' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        const updated = await agent.get('/api/members/' + memberID);
        expect(updated).to.have.status(200);
        expect(updated.body.bio).to.equal('hi');
    });

    // Redeem with insufficient funds
    it('/user/redeem - POST - redeem insufficient', async function() {
        const res = await agent
            .post('/api/user/redeem')
            .send({ redeemableID: redeemableID });
        expect(res).to.be.json;
        expect(res).to.have.status(400);
    });

    // Redeem with sufficient funds
    it('/user/redeem - POST - redeem', async function() {
        // Add some rep
        await MemberActionController.addRep(memberID, 3);
        const member = await agent.get('/api/members/' + memberID);
        expect(member.body.rep).to.equal(3);

        // Redeem
        const res = await agent
            .post('/api/user/redeem')
            .send({ redeemableID: redeemableID });
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        const redeemItem = res.body;
        expect(redeemItem.memberID).to.equal(memberID);
        expect(redeemItem.redeemableID).to.equal(redeemableID);
        redeemItemID = redeemItem.id;
        expect(redeemItem.rep).to.equal(3);

        // Check rep again
        const updatedMember = await agent.get('/api/members/' + memberID);
        expect(updatedMember.body.rep).to.equal(0);
    });

    // Reject the redeem
    it('/redeemed/:redeemableID - PUT', async function() {
        // Reject redeem
        const res = await adminAgent
            .put('/api/redeemed/' + redeemItemID)
            .send({ status: 'Rejected' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        const redeemItem = res.body;
        expect(redeemItem.status).to.equal('Rejected');

        // Check member rep
        const memberRes = await agent.get('/api/members/' + memberID);
        expect(memberRes.body.rep).to.equal(3);
    });
});
