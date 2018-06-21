import chai from 'chai';
const expect = chai.expect;
import app from '../../index';
import * as Member from '../common/member';

// Tests user retrieval of redeemables
describe('Redeemable', function() {
    // Agents
    const agent = chai.request.agent(app);
    const adminAgent = chai.request.agent(app);

    // The ID of test redeemable
    let redeemableID: string;

    // Authenticate
    before(async function() {
        // Login as admin
        const resAdminLogin = await adminAgent
            .post('/api/user/login')
            .send({ username: 'admin', password: 'admin' });
        expect(resAdminLogin).to.be.json;
        expect(resAdminLogin).to.have.status(200);

        // Create redeemable
        const resCreate = await adminAgent.post('/api/redeems').send({
            name: 'Member get test redeemable',
            description: 'des',
            rep: 100000
        });
        expect(resCreate).to.be.json;
        expect(resCreate).to.have.status(200);
        redeemableID = resCreate.body.id;

        await Member.createMember('rdm_get_user', 'rdm_get_user');
        const resMemberLogin = await agent
            .post('/api/user/login')
            .send({ username: 'rdm_get_user', password: 'rdm_get_user' });
        expect(resMemberLogin).to.be.json;
        expect(resMemberLogin).to.have.status(200);
    });

    // Get created redeemable
    it('/redeems/:redeemableID - GET - get redeemable', async function() {
        const res = await agent.get('/api/redeems/' + redeemableID);
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        const r = res.body;
        expect(r).to.have.property('id');
        expect(r.name).to.be.equal('Member get test redeemable');
        expect(r.description).to.be.equal('des');
        expect(r.rep).to.be.equal(100000);
    });

    // Get redeemables
    it('/redeems/redeemables - GET - get specified redeemables', async function() {
        const res = await agent.get('/api/redeems?ids=' + redeemableID);
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body.redeemables).to.have.lengthOf(1);

        for (const redeemable of res.body.redeemables) {
            expect(redeemable).to.have.property('id');
            expect(redeemable.name).to.be.equal('Member get test redeemable');
            expect(redeemable.description).to.be.equal('des');
            expect(redeemable.rep).to.be.equal(100000);
        }
    });

    // Get all redeemables
    it('/redeem - GET - get all active redeemables', async function() {
        const res = await agent.get('/api/redeems?active=true');
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        const r = res.body;
        expect(r).to.have.property('redeemables');
        expect(r.redeemables).to.have.length(1);
    });
});
