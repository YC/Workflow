import chai from 'chai';
const expect = chai.expect;
import { getData, sendData } from './connection';

// Adds team threads
it('Team - Threads', async function() {
    // Login as admin
    const adminLogin = await sendData('/api/user/login', {
        username: 'admin',
        password: 'admin'
    });
    expect(adminLogin).to.have.property('id');

    // Get all teams
    const res = await getData('/api/teams');
    expect(res).to.have.property('teams');

    // Add threads to each team
    for (const team of res.teams) {
        const managerID = team.managers[0];
        const teamID = team.id;

        // Add team thread
        const thread = await sendData('/api/teams/' + teamID + '/threads', {
            title: 'Welcome'
        });
        expect(thread).to.have.property('id');
        const threadID = thread.id;

        // Add comment to thread
        const comment = await sendData(
            '/api/teams/' + teamID + '/threads/' + threadID,
            { message: 'Welcome to the team everyone' }
        );
        expect(thread).to.have.property('id');
    }
});
