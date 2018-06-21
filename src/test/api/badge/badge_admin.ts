import chai from 'chai';
const expect = chai.expect;
import app from '../../index';

// Creation, retrieval and modification of badges
describe('Badge - Admin', function() {
    const agent = chai.request.agent(app);

    // ID of test badge
    let badge_id: string;

    // Authenticate
    before(async function() {
        const res = await agent
            .post('/api/user/login')
            .send({ username: 'admin', password: 'admin' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);
    });

    // Create new badge
    it('/badge - POST - create badge', async function() {
        // Create badge
        const res = await agent
            .post('/api/badges')
            .send({ name: 'Test Badge', description: 'Testing badge' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        const r = res.body;
        expect(r).to.have.property('id');
        expect(r.name).to.be.equal('Test Badge');
        expect(r.description).to.be.equal('Testing badge');

        // Get badge ID for later tests
        badge_id = r._id;
    });

    // Get all badges
    it('/badge - GET - get all badges', async function() {
        const res = await agent.get('/api/badges');
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        const r = res.body;
        expect(r).to.have.property('badges');
        expect(r.badges).to.have.length(1);
        for (const badge of r.badges) {
            expect(badge).to.have.property('id');
            expect(badge.name).to.be.equal('Test Badge');
            expect(badge.description).to.be.equal('Testing badge');
        }
    });

    // Update created badge
    it('/badges/:badgeID - PUT - update badge', async function() {
        const res = await agent
            .put('/api/badges/' + badge_id)
            .send({ name: 'Test badge renamed', active: false });
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        const r = res.body;
        expect(r).to.have.property('id');
        expect(r.name).to.be.equal('Test badge renamed');
        expect(r.description).to.be.equal('Testing badge');
        expect(r.active).to.be.equal(false);
    });
});
