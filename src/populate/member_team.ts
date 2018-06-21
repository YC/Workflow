import chai from 'chai';
const expect = chai.expect;
import { getData, sendData } from './connection';

// Adds members to teams
it('Member Team init', async function() {
    // Declare ID variables
    let teamID: string;
    let managerID: string;
    let memberID: string;
    let overlapID: string;

    // -------------------------------------------------------------------
    // Login as admin
    const adminLogin = await sendData('/api/user/login', {
        username: 'admin',
        password: 'admin'
    });
    expect(adminLogin).to.have.property('id');

    // Get all members
    const res = await getData('/api/members');
    expect(res).to.have.property('members');
    const membersArray = res.members;

    // Add all members to array
    // Start from i = 1 to skip admin
    const members = [];
    for (let i = 1; i < membersArray.length; i++) {
        members.push(membersArray[i].id);
    }

    // -------------------------------------------------------------------
    // Create team one
    const teamOne = await sendData('/api/teams', {
        name: 'Mint Condition',
        shortName: 'mcond'
    });
    expect(teamOne).to.have.property('id');
    teamID = teamOne.id;

    // Create team one manager
    const teamOneManager = await sendData('/api/user/register', {
        firstname: 'John',
        lastname: 'Smith',
        username: 'jsmith',
        email: 'manager',
        password: 'manager',
        type: 'employee'
    });
    expect(teamOneManager).to.have.property('id');
    managerID = teamOneManager.id;

    // Approve manager
    const approveOne = await sendData('/api/members/' + managerID + '/approve');
    expect(approveOne).to.have.property('status');

    // Add manager to team One
    const managerOneAdd = await sendData(
        '/api/teams/' + teamID + '/members/add',
        { memberID: managerID, type: 'manager' }
    );
    expect(managerOneAdd).to.have.property('status');

    // Get first 3 members to first team
    expect(members.length).to.be.at.least(3);
    memberID = members.shift();
    const memberOneAdd = await sendData(
        '/api/teams/' + teamID + '/members/add',
        { memberID: memberID, type: 'member' }
    );
    expect(memberOneAdd).to.have.property('status');

    memberID = members.shift();
    const memberTwoAdd = await sendData(
        '/api/teams/' + teamID + '/members/add',
        { memberID: memberID, type: 'member' }
    );
    expect(memberTwoAdd).to.have.property('status');

    memberID = members.shift();
    const memberThirdAdd = await sendData(
        '/api/teams/' + teamID + '/members/add',
        { memberID: memberID, type: 'member' }
    );
    expect(memberThirdAdd).to.have.property('status');

    overlapID = memberID;

    // -------------------------------------------------------------------
    // Create team two
    const teamTwo = await sendData('/api/teams', {
        name: 'Venturers',
        shortName: 'ventur'
    });
    expect(teamTwo).to.have.property('id');
    teamID = teamTwo.id;

    // Create team two manager
    const teamTwoManager = await sendData('/api/user/register', {
        firstname: 'Bob',
        lastname: 'Dylan',
        username: 'bdylan',
        email: 'manager',
        password: 'manager',
        type: 'employee'
    });
    expect(teamTwoManager).to.have.property('id');
    managerID = teamTwoManager.id;

    // Approve manager
    const approveTwo = await sendData('/api/members/' + managerID + '/approve');
    expect(approveTwo).to.have.property('status');

    // Add manager to team Two
    const managerTwoAdd = await sendData(
        '/api/teams/' + teamID + '/members/add',
        { memberID: managerID, type: 'manager' }
    );
    expect(memberTwoAdd).to.have.property('status');

    // Get first 3 members to first team
    expect(members.length).to.be.at.least(3);
    memberID = members.shift();
    const memberFourAdd = await sendData(
        '/api/teams/' + teamID + '/members/add',
        { memberID: memberID, type: 'member' }
    );
    expect(memberFourAdd).to.have.property('status');

    memberID = members.shift();
    const memberFiveAdd = await sendData(
        '/api/teams/' + teamID + '/members/add',
        { memberID: memberID, type: 'member' }
    );
    expect(memberFiveAdd).to.have.property('status');

    memberID = members.shift();
    const memberSixAdd = await sendData(
        '/api/teams/' + teamID + '/members/add',
        { memberID: memberID, type: 'member' }
    );
    expect(memberSixAdd).to.have.property('status');

    const memberSevenAdd = await sendData(
        '/api/teams/' + teamID + '/members/add',
        { memberID: overlapID, type: 'member' }
    );
    expect(memberSevenAdd).to.have.property('status');

    overlapID = memberID;

    // -------------------------------------------------------------------
    // Create team three
    const teamThree = await sendData('/api/teams', {
        name: 'Quick Crew',
        shortName: 'qcrew'
    });
    expect(teamThree).to.have.property('id');
    teamID = teamThree.id;

    // Create team three manager
    const teamThreeManager = await sendData('/api/user/register', {
        firstname: 'Johnny',
        lastname: 'Bravo',
        username: 'jbravesm8',
        email: 'manager',
        password: 'manager',
        type: 'employee'
    });
    expect(teamThreeManager).to.have.property('id');
    managerID = teamThreeManager.id;

    // Approve manager
    const approveThree = await sendData(
        '/api/members/' + managerID + '/approve'
    );
    expect(approveThree).to.have.property('status');

    // Add manager to team Three
    const managerThreeAdd = await sendData(
        '/api/teams/' + teamID + '/members/add',
        { memberID: managerID, type: 'manager' }
    );
    expect(managerThreeAdd).to.have.property('status');

    // Get first 3 members to first team
    expect(members.length).to.be.at.least(3);
    memberID = members.shift();
    const memberEightAdd = await sendData(
        '/api/teams/' + teamID + '/members/add',
        { memberID: memberID, type: 'member' }
    );
    expect(memberEightAdd).to.have.property('status');

    memberID = members.shift();
    const memberNineAdd = await sendData(
        '/api/teams/' + teamID + '/members/add',
        { memberID: memberID, type: 'member' }
    );
    expect(memberNineAdd).to.have.property('status');

    memberID = members.shift();
    const memberTenAdd = await sendData(
        '/api/teams/' + teamID + '/members/add',
        { memberID: memberID, type: 'member' }
    );
    expect(memberTenAdd).to.have.property('status');

    const memberElevenAdd = await sendData(
        '/api/teams/' + teamID + '/members/add',
        { memberID: overlapID, type: 'member' }
    );
    expect(memberElevenAdd).to.have.property('status');

    overlapID = memberID;

    // -------------------------------------------------------------------
    // Create team four
    const teamFour = await sendData('/api/teams', {
        name: 'The Zephyrs',
        shortName: 'zeph'
    });
    expect(teamFour).to.have.property('id');
    teamID = teamFour.id;

    // Create team four manager
    const teamFourManager = await sendData('/api/user/register', {
        firstname: 'Steven',
        lastname: 'Tang',
        username: 'yc',
        email: 'manager',
        password: 'manager',
        type: 'employee'
    });
    expect(teamFourManager).to.have.property('id');
    managerID = teamFourManager.id;

    // Approve manager
    const approveFour = await sendData(
        '/api/members/' + managerID + '/approve'
    );
    expect(approveFour).to.have.property('status');

    // Add manager to team Four
    const managerFourAdd = await sendData(
        '/api/teams/' + teamID + '/members/add',
        { memberID: managerID, type: 'manager' }
    );
    expect(managerFourAdd).to.have.property('status');

    // Get first 3 members to first team
    expect(members.length).to.be.at.least(3);
    memberID = members.shift();
    const memberTwelveAdd = await sendData(
        '/api/teams/' + teamID + '/members/add',
        { memberID: memberID, type: 'member' }
    );
    expect(memberTwelveAdd).to.have.property('status');

    memberID = members.shift();
    const memberThirteenAdd = await sendData(
        '/api/teams/' + teamID + '/members/add',
        { memberID: memberID, type: 'member' }
    );
    expect(memberThirteenAdd).to.have.property('status');

    memberID = members.shift();
    const memberFourteenAdd = await sendData(
        '/api/teams/' + teamID + '/members/add',
        { memberID: overlapID, type: 'member' }
    );
    expect(memberFourteenAdd).to.have.property('status');

    overlapID = memberID;

    // -------------------------------------------------------------------
    // Create team five
    const teamFive = await sendData('/api/teams', {
        name: 'Innovators',
        shortName: 'innov'
    });
    expect(teamFive).to.have.property('id');
    teamID = teamFive.id;

    // Create team five manager
    const teamFiveManager = await sendData('/api/user/register', {
        firstname: 'Eduardo',
        lastname: 'Velloso',
        username: 'eduardoBrazil',
        email: 'velloso@gmail.com',
        password: 'manager',
        type: 'employee'
    });
    expect(teamFiveManager).to.have.property('id');
    managerID = teamFiveManager.id;

    // Approve manager
    const approveFive = await sendData(
        '/api/members/' + managerID + '/approve'
    );
    expect(approveFive).to.have.property('status');

    // Add manager to team Five
    const managerFiveAdd = await sendData(
        '/api/teams/' + teamID + '/members/add',
        { memberID: managerID, type: 'manager' }
    );
    expect(managerFiveAdd).to.have.property('status');

    // Get first 3 members to first team
    expect(members.length).to.be.at.least(3);
    memberID = members.shift();
    const memberFifteenAdd = await sendData(
        '/api/teams/' + teamID + '/members/add',
        { memberID: memberID, type: 'member' }
    );
    expect(memberFifteenAdd).to.have.property('status');

    memberID = members.shift();
    const memberSixteenAdd = await sendData(
        '/api/teams/' + teamID + '/members/add',
        { memberID: memberID, type: 'member' }
    );
    expect(memberSixteenAdd).to.have.property('status');

    memberID = members.shift();
    const memberSeventeenAdd = await sendData(
        '/api/teams/' + teamID + '/members/add',
        { memberID: overlapID, type: 'member' }
    );
    expect(memberSeventeenAdd).to.have.property('status');
});
