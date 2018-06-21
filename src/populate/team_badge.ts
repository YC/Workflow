import chai from 'chai';
const expect = chai.expect;
import { sendData, getData } from './connection';

// Award badges to members
it('Team - Award badges', async function() {
    // Login as admin
    const adminLogin = await sendData('/api/user/login', {
        username: 'admin',
        password: 'admin'
    });
    expect(adminLogin).to.have.property('id');

    // Request all teams
    const res = await getData('/api/teams');
    expect(res).to.have.property('teams');

    // Update rep for each team
    for (const team of res.teams) {
        const teamID = team.id;
        const rep = await sendData('/api/teams/' + teamID, { rep: 200 }, 'PUT');
        expect(rep).to.have.property('id');
    }

    // Get badges
    const badgeItems = await getData('/api/badges');
    expect(badgeItems).to.have.property('badges');

    // Go through each team and award badges
    for (const team of res.teams) {
        // Go through each member
        for (const id of team.members) {
            // Award badges
            for (const badge of badgeItems.badges) {
                const award = await sendData(
                    '/api/teams/' + team.id + '/award/badge',
                    { memberID: id, rep: 3, badgeID: badge.id }
                );
                expect(award).to.have.property('status');
                expect(award.status).to.equal('success');
            }
        }
    }
});
