import chai from 'chai';
const expect = chai.expect;
import { getData, sendData } from './connection';

// Adds member posts
it('Member Post init', async function() {
    // Login as admin
    const adminLogin = await sendData('/api/user/login', {
        username: 'admin',
        password: 'admin'
    });
    expect(adminLogin).to.have.property('id');

    // Request all members
    const res = await getData('/api/members');
    expect(res).to.have.property('members');

    // Add all member IDs to array
    const members = [];
    for (const member of res.members) {
        members.push(member.id);
    }

    // Increase rep of each member
    for (const id of members) {
        const rep = await sendData('/api/members/' + id, { rep: 30 }, 'PUT');
        expect(rep).to.have.property('id');
    }

    // -------------------------------------------------------------------
    // ID of current member
    let memberID: string;

    // -------------------------------------------------------------------
    // User One
    expect(members.length).to.be.at.least(1);
    // Login
    memberID = members.shift();
    const memberOneLogin = await sendData('/api/user/login', {
        username: 'kivpol',
        password: 'isturkish'
    });
    expect(memberOneLogin).to.have.property('id');

    // Create post one
    const memberPostOne = await sendData(
        '/api/members/' + memberID + '/posts',
        {
            memberID: memberID,
            message:
                'Hello everyone, there is a barbeque happening this weekend.',
            rep: 5
        }
    );
    expect(memberPostOne).to.have.property('id');

    // -------------------------------------------------------------------
    // User two
    expect(members.length).to.be.at.least(1);
    memberID = members.shift();

    // Login
    const memberTwoLogin = await sendData('/api/user/login', {
        username: 'vasili',
        password: 'ilovepuppies'
    });
    expect(memberTwoLogin).to.have.property('id');

    // Create post
    const memberPostTwo = await sendData(
        '/api/members/' + memberID + '/posts',
        {
            memberID: memberID,
            userID: 2,
            message:
                'Hello developers, we have made progress with the blockchain project.',
            rep: 5
        }
    );
    expect(memberPostTwo).to.have.property('id');

    // -------------------------------------------------------------------
    // User three
    expect(members.length).to.be.at.least(1);
    memberID = members.shift();

    // Login
    const memberThreeLogin = await sendData('/api/user/login', {
        username: 'Award',
        password: 'awardman'
    });
    expect(memberThreeLogin).to.have.property('id');

    // Create post
    const memberPostThree = await sendData(
        '/api/members/' + memberID + '/posts',
        {
            memberID: memberID,
            userID: 3,
            message:
                "It's good weather out today, perhaps we could move our brainstorm session outside.",
            rep: 5
        }
    );
    expect(memberPostThree).to.have.property('id');

    // -------------------------------------------------------------------
    // User four
    expect(members.length).to.be.at.least(1);
    memberID = members.shift();

    // Login
    const memberFourLogin = await sendData('/api/user/login', {
        username: 'barryw',
        password: 'berry'
    });
    expect(memberFourLogin).to.have.property('id');

    // Create post
    const memberPostFour = await sendData(
        '/api/members/' + memberID + '/posts',
        {
            memberID: memberID,
            userID: 4,
            message: 'I have to deployed the new automation feature.',
            rep: 5
        }
    );
    expect(memberPostFour).to.have.property('id');

    // -------------------------------------------------------------------
    // User five
    expect(members.length).to.be.at.least(1);
    memberID = members.shift();

    // Login
    const memberFiveLogin = await sendData('/api/user/login', {
        username: 'garricke',
        password: 'rickrolled'
    });
    expect(memberFiveLogin).to.have.property('id');

    // Create post
    const memberPostFive = await sendData(
        '/api/members/' + memberID + '/posts',
        {
            memberID: memberID,
            userID: 5,
            message:
                'We have finally deployed our new API server with no problem this week.',
            rep: 5
        }
    );
    expect(memberPostFive).to.have.property('id');

    // -------------------------------------------------------------------
    // User six
    expect(members.length).to.be.at.least(1);
    memberID = members.shift();

    // Login
    const memberSixLogin = await sendData('/api/user/login', {
        username: 'IMM',
        password: 'thehill'
    });
    expect(memberSixLogin).to.have.property('id');

    // Create post
    const memberPostSix = await sendData(
        '/api/members/' + memberID + '/posts',
        {
            memberID: memberID,
            userID: 6,
            message:
                'Our new algoritm has been developed to aid the development of the new feature.',
            rep: 5
        }
    );
    expect(memberPostSix).to.have.property('id');

    // -------------------------------------------------------------------
    // User seven
    expect(members.length).to.be.at.least(1);
    memberID = members.shift();

    // Login
    const memberSevenLogin = await sendData('/api/user/login', {
        username: 'MM87',
        password: 'machinelearning'
    });
    expect(memberSevenLogin).to.have.property('id');

    // Create post
    const memberPostSeven = await sendData(
        '/api/members/' + memberID + '/posts',
        {
            memberID: memberID,
            userID: 7,
            message: 'The HR department has decided upon two new interns.',
            rep: 5
        }
    );
    expect(memberPostSeven).to.have.property('id');

    // -------------------------------------------------------------------
    // User eight
    expect(members.length).to.be.at.least(1);
    memberID = members.shift();

    // Login
    const memberEightLogin = await sendData('/api/user/login', {
        username: 'kl9',
        password: 'chinanumberone'
    });
    expect(memberEightLogin).to.have.property('id');

    // Create post
    const memberPostEight = await sendData(
        '/api/members/' + memberID + '/posts',
        {
            memberID: memberID,
            userID: 8,
            message: 'The agile conference is this weekend folks.',
            rep: 5
        }
    );
    expect(memberPostEight).to.have.property('id');

    // -------------------------------------------------------------------
    // User nine
    expect(members.length).to.be.at.least(1);
    memberID = members.shift();

    // Login
    const memberNineLogin = await sendData('/api/user/login', {
        username: 'beracha12',
        password: 'mountains'
    });
    expect(memberNineLogin).to.have.property('id');

    // Create post
    const memberPostNine = await sendData(
        '/api/members/' + memberID + '/posts',
        {
            memberID: memberID,
            userID: 9,
            message:
                'A new initiave is being tried out. Security is escorting over-time employees to nearby stations.',
            rep: 5
        }
    );
    expect(memberPostNine).to.have.property('id');

    // -------------------------------------------------------------------
    // User ten
    expect(members.length).to.be.at.least(1);
    memberID = members.shift();

    // Login
    const memberTenLogin = await sendData('/api/user/login', {
        username: 'AmTa',
        password: 'tuas'
    });
    expect(memberTenLogin).to.have.property('id');

    // Create post
    const memberPostTen = await sendData(
        '/api/members/' + memberID + '/posts',
        {
            memberID: memberID,
            userID: 10,
            message: 'Group meeting at 2pm tomorrow team.',
            rep: 5
        }
    );
    expect(memberPostTen).to.have.property('id');

    // -------------------------------------------------------------------
    // User eleven
    expect(members.length).to.be.at.least(1);
    memberID = members.shift();

    // Login
    const memberElevenLogin = await sendData('/api/user/login', {
        username: 'mehdi93',
        password: 'iwishiwasamanager'
    });
    expect(memberElevenLogin).to.have.property('id');

    // Create post
    const memberPostEleven = await sendData(
        '/api/members/' + memberID + '/posts',
        {
            memberID: memberID,
            userID: 11,
            message: 'Free snags are coming soon!',
            rep: 5
        }
    );
    expect(memberPostEleven).to.have.property('id');

    // -------------------------------------------------------------------
    // User twelve
    expect(members.length).to.be.at.least(1);
    memberID = members.shift();

    // Login
    const memberTwelveLogin = await sendData('/api/user/login', {
        username: 'geiszler75',
        password: 'bitcoin'
    });
    expect(memberTwelveLogin).to.have.property('id');

    // Create post
    const memberPostTwelve = await sendData(
        '/api/members/' + memberID + '/posts',
        {
            memberID: memberID,
            userID: 12,
            message:
                'Our client has requested for a new search feature to be implemented. However this is already being taken care of by my team',
            rep: 5
        }
    );
    expect(memberPostTwelve).to.have.property('id');

    // -------------------------------------------------------------------
    // User thirtenen
    expect(members.length).to.be.at.least(1);
    memberID = members.shift();

    // Login
    const memberThirteenLogin = await sendData('/api/user/login', {
        username: 'ninat',
        password: 'yams'
    });
    expect(memberThirteenLogin).to.have.property('id');

    // Create post
    const memberPostThirteen = await sendData(
        '/api/members/' + memberID + '/posts',
        {
            memberID: memberID,
            userID: 13,
            message:
                'We have organised a visit from Facebook Australian Team on Monday.',
            rep: 5
        }
    );
    expect(memberPostThirteen).to.have.property('id');

    // -------------------------------------------------------------------
    // User fourteen
    expect(members.length).to.be.at.least(1);
    memberID = members.shift();

    // Login
    const memberFourteenLogin = await sendData('/api/user/login', {
        username: 'GBAF',
        password: '98jUY34n12D'
    });
    expect(memberFourteenLogin).to.have.property('id');

    // Create post
    const memberPostFourteen = await sendData(
        '/api/members/' + memberID + '/posts',
        {
            memberID: memberID,
            userID: 14,
            message:
                'I call for a destress meditation session at 4pm Wednesday.',
            rep: 5
        }
    );
    expect(memberPostFourteen).to.have.property('id');

    // -------------------------------------------------------------------
    // User fifteen
    expect(members.length).to.be.at.least(1);
    memberID = members.shift();

    // Login
    const memberFifteenLogin = await sendData('/api/user/login', {
        username: 'misong',
        password: 'ilovemyoppa'
    });
    expect(memberFifteenLogin).to.have.property('id');

    // Create post
    const memberPostFifteen = await sendData(
        '/api/members/' + memberID + '/posts',
        {
            memberID: memberID,
            userID: 15,
            message: 'There would be a Bring-Your-Pet day coming next month!',
            rep: 5
        }
    );
    expect(memberPostFifteen).to.have.property('id');
});
