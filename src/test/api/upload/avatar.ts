import chai from 'chai';
const expect = chai.expect;
import app from '../../index';
import * as Member from '../common/member';
const { readFileSync } = require('fs');

// Tests avatar uploads
describe('Upload Avatar', function() {
    const adminAgent = chai.request.agent(app);
    const memberAgent = chai.request.agent(app);

    let badgeID: string;
    let memberID: string;
    let teamID: string;

    // Authenticate
    before(async function() {
        // Login as admin
        const res = await adminAgent
            .post('/api/user/login')
            .send({ username: 'admin', password: 'admin' });
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        // Create a badge and set the id
        const resBadge = await adminAgent
            .post('/api/badges')
            .send({ name: 'Avatar Badge', description: '...' });
        expect(resBadge).to.be.json;
        expect(resBadge).to.have.status(200);
        badgeID = resBadge.body.id;

        // Create and login as member
        memberID = await Member.createMember('mavatar', 'mavatar');
        const resMemberLogin = await memberAgent
            .post('/api/user/login')
            .send({ username: 'mavatar', password: 'mavatar' });
        expect(resMemberLogin).to.be.json;
        expect(resMemberLogin).to.have.status(200);
        memberID = resMemberLogin.body.id;

        // Create Team
        const resTeam = await adminAgent
            .post('/api/teams')
            .send({ name: 'Test Team', shortName: 'avatartest' });
        expect(resTeam).to.be.json;
        expect(resTeam).to.have.status(200);
        teamID = resTeam.body.id;
    });

    // Upload an avatar for the created badge
    it('Badge - /api/badges/:badgeID/avatar - PUT', async function() {
        const res = await adminAgent
            .put('/api/badges/' + badgeID + '/avatar')
            .set('Content-Type', 'multipart/formdata')
            .attach('avatar', readFileSync(__dirname + '/yc.png'), 'yc.png');
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        const r = res.body;
        expect(r).to.have.property('avatar');
    });

    // Upload an avatar for the created member
    it('Member - /api/members/:memberID/avatar - PUT', async function() {
        const res = await memberAgent
            .put('/api/members/' + memberID + '/avatar')
            .set('Content-Type', 'multipart/formdata')
            .attach('avatar', readFileSync(__dirname + '/yc.png'), 'yc.png');
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        const r = res.body;
        expect(r).to.have.property('avatar');
    });

    // Upload an avatar for the created team
    it('Team - /api/teams/:teamID/avatar - PUT', async function() {
        const res = await adminAgent
            .put('/api/teams/' + teamID + '/avatar')
            .set('Content-Type', 'multipart/formdata')
            .attach('avatar', readFileSync(__dirname + '/yc.png'), 'yc.png');
        expect(res).to.be.json;
        expect(res).to.have.status(200);

        const r = res.body;
        expect(r).to.have.property('avatar');
    });
});
