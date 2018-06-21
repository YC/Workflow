import chai from 'chai';
const expect = chai.expect;
import app from '../../index';

// Creates a member with the specified username/password
export let createMember = async function(username: string, password: string) {
    // Login as admin
    const adminAgent = chai.request.agent(app);
    const res = await adminAgent
        .post('/api/user/login')
        .send({ username: 'admin', password: 'admin' });
    expect(res).to.be.json;
    expect(res).to.have.status(200);

    // Create member
    const member = await adminAgent.post('/api/user/register').send({
        firstname: 'Test',
        lastname: 'User',
        username: username,
        email: 'A',
        password: password,
        type: 'employee'
    });
    expect(member).to.be.json;
    expect(member).to.have.status(200);

    // Approve member registration
    const approve = await adminAgent.post(
        '/api/members/' + member.body.id + '/approve'
    );
    expect(approve).to.be.json;
    expect(approve).to.have.status(200);
    return member.body.id;
};
