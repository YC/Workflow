import chai from 'chai';
const expect = chai.expect;
import { createReadStream } from 'fs';
import FormData from 'form-data';
import { getData, sendData, putAvatar } from './connection';

// Adds badges
it('Badge init', async function() {
    // Stores ID of current badge
    let badgeID: string;

    // -------------------------------------------------------------------
    // Login as admin
    const adminLogin = await sendData('/api/user/login', {
        username: 'admin',
        password: 'admin'
    });
    expect(adminLogin).to.have.property('id');

    // -------------------------------------------------------------------
    // Create badge one
    const badgeOne = await sendData('/api/badges', {
        name: 'Great work',
        description: 'Task is done very nicely.'
    });
    expect(badgeOne).to.have.property('id');
    badgeID = badgeOne.id;

    // Upload avatar for badge one
    const formDataOne = new FormData();
    formDataOne.append('avatar', createReadStream(__dirname + '/Icon2.png'));
    const avatarBadgeOne = await putAvatar(
        '/api/badges/' + badgeID + '/avatar',
        formDataOne
    );
    expect(avatarBadgeOne).to.have.property('avatar');

    // -------------------------------------------------------------------
    // Create badge two
    const badgeTwo = await sendData('/api/badges', {
        name: 'Nice Post',
        description: 'You made a nice post.'
    });
    expect(badgeTwo).to.have.property('id');
    badgeID = badgeTwo.id;

    // Upload avatar for badge two
    const formDataTwo = new FormData();
    formDataTwo.append('avatar', createReadStream(__dirname + '/Icon5.png'));
    const avatarBadgeTwo = await putAvatar(
        '/api/badges/' + badgeID + '/avatar',
        formDataTwo
    );
    expect(avatarBadgeTwo).to.have.property('avatar');

    // -------------------------------------------------------------------
    // Create badge three
    const badgeThree = await sendData('/api/badges', {
        name: 'Thumbs Up',
        description: 'Task completed.'
    });
    expect(badgeThree).to.have.property('id');
    badgeID = badgeThree.id;

    // Upload avatar for badge three
    const formDataThree = new FormData();
    formDataThree.append('avatar', createReadStream(__dirname + '/Icon3.png'));
    const avatarBadgeThree = await putAvatar(
        '/api/badges/' + badgeID + '/avatar',
        formDataThree
    );
    expect(avatarBadgeThree).to.have.property('avatar');

    // -------------------------------------------------------------------
    // Create badge four
    const badgeFour = await sendData('/api/badges', {
        name: 'Star',
        description: "You're a star worker"
    });
    expect(badgeFour).to.have.property('id');
    badgeID = badgeFour.id;

    // Upload avatar for badge four
    const formDataFour = new FormData();
    formDataFour.append('avatar', createReadStream(__dirname + '/Icon1.png'));
    const avatarBadgeFour = await putAvatar(
        '/api/badges/' + badgeID + '/avatar',
        formDataFour
    );
    expect(avatarBadgeFour).to.have.property('avatar');

    // -------------------------------------------------------------------
    // Create badge five
    const badgeFive = await sendData('/api/badges', {
        name: 'Appreciation',
        description: "You've helped someone do their work."
    });
    expect(badgeFive).to.have.property('id');
    badgeID = badgeFive.id;

    // Upload avatar for badge five
    const formDataFive = new FormData();
    formDataFive.append('avatar', createReadStream(__dirname + '/Icon4.png'));
    const avatarBadgeFive = await putAvatar(
        '/api/badges/' + badgeID + '/avatar',
        formDataFive
    );
    expect(avatarBadgeFive).to.have.property('avatar');
});
