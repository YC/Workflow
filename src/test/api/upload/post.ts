import chai from 'chai';
const expect = chai.expect;
import app from '../../index';
import * as Member from '../common/member';
const { readFileSync } = require('fs');
import * as MemberActionController from '../../../controllers/member/member_rep';

// Tests post uploads (with attachments)
describe('Member Post Upload', function() {
    const adminAgent = chai.request.agent(app);
    const memberAgent = chai.request.agent(app);

    let memberID: string;
    let adminID: string;

    // Authenticate
    before(async function() {
        // Login as admin
        const res = await adminAgent
            .post('/api/user/login')
            .send({ username: 'admin', password: 'admin' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        adminID = res.body.id;

        // Create and login as member
        memberID = await Member.createMember('postmember', 'postmember');
        const resMemberLogin = await memberAgent
            .post('/api/user/login')
            .send({ username: 'postmember', password: 'postmember' });
        expect(resMemberLogin).to.be.json;
        expect(resMemberLogin).to.have.status(200);
        memberID = resMemberLogin.body.id;
    });

    // Add a member post with images
    it('Add post - /api/members/:memberID/posts - POST', async function() {
        // Add some rep to the user
        await MemberActionController.addRep(adminID, 3);

        const res = await adminAgent
            .post('/api/members/' + memberID + '/posts')
            .set('Content-Type', 'multipart/formdata')
            .field('message', 'hello')
            .field('rep', 3)
            .attach('files[]', readFileSync(__dirname + '/yc.png'), 'yc.png')
            .attach('files[]', readFileSync(__dirname + '/yc.png'), 'yc2.png');
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('photos');
    });
});
