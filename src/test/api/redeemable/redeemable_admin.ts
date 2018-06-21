import chai from 'chai';
const expect = chai.expect;
import app from '../../index';

// Creation, retrieval and modification of redeemables
describe('Redeemable - Admin', function() {
    const agent = chai.request.agent(app);

    // ID of test redeemable
    let redeemableID: string;

    // Authenticate
    before(async function() {
        const res = await agent
            .post('/api/user/login')
            .send({ username: 'admin', password: 'admin' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);
    });

    // Create new redeemable
    it('/redeem - POST - create redeemable', async function() {
        const res = await agent.post('/api/redeems').send({
            name: 'Test redeemable',
            description: 'Testing redeemable',
            rep: 1000
        });
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        const r = res.body;
        expect(r).to.have.property('id');
        expect(r.name).to.be.equal('Test redeemable');
        expect(r.description).to.be.equal('Testing redeemable');
        expect(r.rep).to.be.equal(1000);

        // Get redeemable ID for later tests
        redeemableID = r._id;
    });

    // Get all redeemables
    it('/redeem - GET - get all redeemables', async function() {
        const res = await agent.get('/api/redeems');
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        const r = res.body;
        expect(r).to.have.property('redeemables');
        expect(r.redeemables).to.have.length(1);
        for (const redeemable of r.redeemables) {
            expect(redeemable).to.have.property('id');
            expect(redeemable.name).to.be.equal('Test redeemable');
            expect(redeemable.description).to.be.equal('Testing redeemable');
            expect(redeemable.rep).to.be.equal(1000);
        }
    });

    // Update created redeemable
    it('/redeems/:redeemableID - PUT - update redeemable', async function() {
        const res = await agent.put('/api/redeems/' + redeemableID).send({
            name: 'Test redeemable renamed',
            active: false,
            rep: 5000
        });
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        const r = res.body;
        expect(r).to.have.property('id');
        expect(r.name).to.be.equal('Test redeemable renamed');
        expect(r.description).to.be.equal('Testing redeemable');
        expect(r.rep).to.be.equal(5000);
        expect(r.active).to.equal(false);
    });
});
