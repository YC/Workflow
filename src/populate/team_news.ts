import chai from 'chai';
const expect = chai.expect;
import { getData, sendData } from './connection';

// Adds team news items
it('Team - News', async function() {
    // Login as admin
    const adminLogin = await sendData('/api/user/login', {
        username: 'admin',
        password: 'admin'
    });
    expect(adminLogin).to.have.property('id');

    // Get all teams
    const res = await getData('/api/teams');
    expect(res).to.have.property('teams');

    // Add news items to each team
    for (const team of res.teams) {
        // Add news item
        const newsOne = await sendData('/api/teams/' + team.id + '/news', {
            message: 'Welcome to team ' + team.name
        });
        expect(newsOne).to.have.property('id');

        // Add news item two
        const newsTwo = await sendData('/api/teams/' + team.id + '/news', {
            message: 'First team meeting at 3pm today'
        });
        expect(newsTwo).to.have.property('id');
    }
});
