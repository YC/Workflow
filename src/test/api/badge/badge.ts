import chai from 'chai';
const expect = chai.expect;
import app from '../../index';
import * as Member from '../common/member';

// Retrieval of badges
describe('Badge', function() {
    // ID of test badge
    let badge_id: string;

    const agent = chai.request.agent(app);
    const adminAgent = chai.request.agent(app);

    // Authenticate
    before(async function() {
        // Login as admin
        const resAdminLogin = await adminAgent
            .post('/api/user/login')
            .send({ username: 'admin', password: 'admin' });
        expect(resAdminLogin).to.be.json;
        expect(resAdminLogin).to.have.status(200);

        // Create redeemable
        const resCreate = await adminAgent.post('/api/badges').send({
            name: 'The mighty one',
            description: 'x2'
        });
        expect(resCreate).to.be.json;
        expect(resCreate).to.have.status(200);
        badge_id = resCreate.body.id;

        await Member.createMember('badge_get_user', 'badge_get_user');
        const resMemberLogin = await agent
            .post('/api/user/login')
            .send({ username: 'badge_get_user', password: 'badge_get_user' });
        expect(resMemberLogin).to.be.json;
        expect(resMemberLogin).to.have.status(200);
    });

    // Get created badge
    it('/badges/:badgeID - GET - get badge', async function() {
        const res = await agent.get('/api/badges/' + badge_id);
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        const r = res.body;
        expect(r).to.have.property('id');
        expect(r.name).to.be.equal('The mighty one');
        expect(r.description).to.be.equal('x2');
    });

    // Get badges
    it('/badges/badges - GET - get specified badges', async function() {
        const res = await agent.get('/api/badges?ids=' + badge_id);
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body.badges).to.have.lengthOf(1);

        for (const badge of res.body.badges) {
            expect(badge).to.have.property('id');
            expect(badge.name).to.be.equal('The mighty one');
            expect(badge.description).to.be.equal('x2');
        }
    });

    // Get all badges
    it('/badge - GET - get all active badges', async function() {
        const res = await agent.get('/api/badges?active=true');
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        const r = res.body;
        expect(r).to.have.property('badges');
        expect(r.badges).to.have.length(1);
    });
});
