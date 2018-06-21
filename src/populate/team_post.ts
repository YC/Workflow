import chai from 'chai';
const expect = chai.expect;
import { getData, sendData } from './connection';

// Adds team posts
it('Team Post init', async function() {
    // Login as admin
    const adminLogin = await sendData('/api/user/login', {
        username: 'admin',
        password: 'admin'
    });
    expect(adminLogin).to.have.property('id');

    // Get all teams
    const res = await getData('/api/teams');
    expect(res).to.have.property('teams');

    // Get team and manager info
    const teams: any = [];
    const managers: any = {};
    for (const team of res.teams) {
        // Add team to array
        teams.push(team);

        // Get manager and add to managers object with ID as key
        const manager = await getData('/api/members/' + team.managers[0]);
        managers[manager.id] = manager;
    }

    // -------------------------------------------------------------------
    // Team post one
    expect(teams.length).to.be.at.least(1);
    const teamOne = teams.shift();

    // Login as manager
    const managerLoginOne = await sendData('/api/user/login', {
        username: managers[teamOne.managers[0]].username,
        password: 'manager'
    });
    expect(managerLoginOne).to.have.property('id');

    // Create team post one
    const teamPostOne = await sendData('/api/teams/' + teamOne.id + '/posts', {
        message: 'Hi guys, how is everyone going?'
    });
    expect(teamPostOne).to.have.property('id');

    // -------------------------------------------------------------------
    // Team post two
    expect(teams.length).to.be.at.least(1);
    const teamTwo = teams.shift();

    // Login as manager
    const managerLoginTwo = await sendData('/api/user/login', {
        username: managers[teamTwo.managers[0]].username,
        password: 'manager'
    });
    expect(managerLoginTwo).to.have.property('id');

    // Create team post two
    const teamPostTwo = await sendData('/api/teams/' + teamTwo.id + '/posts', {
        message: 'Hi all, group meeting at 3pm'
    });
    expect(teamPostTwo).to.have.property('id');

    // -------------------------------------------------------------------
    // Team post three
    expect(teams.length).to.be.at.least(1);
    const teamThree = teams.shift();

    // Login as manager
    const managerLoginThree = await sendData('/api/user/login', {
        username: managers[teamThree.managers[0]].username,
        password: 'manager'
    });
    expect(managerLoginThree).to.have.property('id');

    // Create team post three
    const teamPostThree = await sendData(
        '/api/teams/' + teamThree.id + '/posts',
        { message: 'Hi all, lunch at 1pm' }
    );
    expect(teamPostThree).to.have.property('id');

    // -------------------------------------------------------------------
    // Team post four
    expect(teams.length).to.be.at.least(1);
    const teamFour = teams.shift();

    // Login as manager
    const managerLoginFour = await sendData('/api/user/login', {
        username: managers[teamFour.managers[0]].username,
        password: 'manager'
    });
    expect(managerLoginFour).to.have.property('id');

    // Create team post four
    const teamPostFour = await sendData(
        '/api/teams/' + teamFour.id + '/posts',
        { message: 'Hi everyone, welcome!' }
    );
    expect(teamPostFour).to.have.property('id');

    // -------------------------------------------------------------------
    // Team post five
    expect(teams.length).to.be.at.least(1);
    const teamFive = teams.shift();

    // Login as manager
    const managerLoginFive = await sendData('/api/user/login', {
        username: managers[teamFive.managers[0]].username,
        password: 'manager'
    });
    expect(managerLoginFive).to.have.property('id');

    // Create team post five
    const teamPostFive = await sendData(
        '/api/teams/' + teamFive.id + '/posts',
        { message: 'Hi guys, make sure to fill in form later' }
    );
    expect(teamPostFive).to.have.property('id');
});
