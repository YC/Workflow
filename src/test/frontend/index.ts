import chai from 'chai';
const expect = chai.expect;
import chaiHttp from 'chai-http';
chai.use(chaiHttp);

import app from '../';

// Tests frontend routes
describe('Frontend', function() {
    const agent = chai.request.agent(app);

    // Test index route
    it('/ - GET', async function() {
        const res = await agent.get('/');
        expect(res).to.have.status(200);
        expect(res).to.be.html;
    });

    // Test admin route
    it('/admin - GET', async function() {
        const res = await agent.get('/admin');
        expect(res).to.have.status(200);
        expect(res).to.be.html;
    });
});
