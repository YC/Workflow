import chai from 'chai';
const expect = chai.expect;
import { getData, sendData } from './connection';
import * as Member from '../controllers/member/member';

// Adds members
it('Member init', async function() {
    // ID of member who is currently being processed
    let memberID: string;

    // Create admin user
    const resAdminRegister = await sendData('/api/user/register', {
        firstname: 'Admin',
        lastname: 'Admin',
        username: 'admin',
        password: 'admin',
        email: 'admin',
        type: 'employee'
    });
    await Member.makeAdmin(resAdminRegister.id);

    // Login as admin
    const resAdminLogin = await sendData('/api/user/login', {
        username: 'admin',
        password: 'admin'
    });

    // -------------------------------------------------------------------
    // Create member one
    const resRegisterOne = await sendData('/api/user/register', {
        firstname: 'Kivanc',
        lastname: 'Polat',
        username: 'kivpol',
        email: 'kp@gmail.com',
        password: 'isturkish',
        type: 'employee'
    });
    memberID = resRegisterOne.id;

    // Approve member
    const approveOne = await sendData('/api/members/' + memberID + '/approve');

    // -------------------------------------------------------------------
    // Create member two
    const resRegisterTwo = await sendData('/api/user/register', {
        firstname: 'Vasili',
        lastname: 'Kanevsky',
        username: 'vasili',
        email: 'vk@gmail.com',
        password: 'ilovepuppies',
        type: 'employee'
    });
    memberID = resRegisterTwo.id;

    // Approve member
    const approveTwo = await sendData('/api/members/' + memberID + '/approve');

    // -------------------------------------------------------------------
    // Create member three
    const resRegisterThree = await sendData('/api/user/register', {
        firstname: 'Ahn',
        lastname: 'Ward',
        username: 'Award',
        email: 'aw@gmail.com',
        password: 'awardman',
        type: 'employee'
    });
    memberID = resRegisterThree.id;

    // Approve member
    const approveThree = await sendData(
        '/api/members/' + memberID + '/approve'
    );

    // -------------------------------------------------------------------
    // Create member four
    const resRegisterFour = await sendData('/api/user/register', {
        firstname: 'Barry',
        lastname: 'Wilson',
        username: 'barryw',
        email: 'barryw@gmail.com',
        password: 'berry',
        type: 'employee'
    });
    memberID = resRegisterFour.id;

    // Approve member
    const approveFour = await sendData('/api/members/' + memberID + '/approve');

    // -------------------------------------------------------------------
    // Create member five
    const resRegisterFive = await sendData('/api/user/register', {
        firstname: 'Garrick',
        lastname: 'Everhart',
        username: 'garricke',
        email: 'ricked@gmail.com',
        password: 'rickrolled',
        type: 'employee'
    });
    memberID = resRegisterFive.id;

    // Approve member
    const approveFive = await sendData('/api/members/' + memberID + '/approve');

    // -------------------------------------------------------------------
    // Create member six
    const resRegisterSix = await sendData('/api/user/register', {
        firstname: 'Ibrahim',
        lastname: 'Mustafa',
        username: 'IMM',
        email: 'imm@gmail.com',
        password: 'thehill',
        type: 'employee'
    });
    memberID = resRegisterSix.id;

    // Approve member
    const approveSix = await sendData('/api/members/' + memberID + '/approve');

    // -------------------------------------------------------------------
    // Create member seven
    const resRegisterSeven = await sendData('/api/user/register', {
        firstname: 'Mia',
        lastname: 'Masumura',
        username: 'MM87',
        email: 'masumura87@gmail.com',
        password: 'machinelearning',
        type: 'employee'
    });
    memberID = resRegisterSeven.id;

    // Approve member
    const approveSeven = await sendData(
        '/api/members/' + memberID + '/approve'
    );

    // -------------------------------------------------------------------
    // Create member eight
    const resRegisterEight = await sendData('/api/user/register', {
        firstname: 'Kaijie',
        lastname: 'Lin',
        username: 'kl9',
        email: 'kaijie@163.com',
        password: 'chinanumberone',
        type: 'employee'
    });
    memberID = resRegisterEight.id;

    // Approve member
    const approveEight = await sendData(
        '/api/members/' + memberID + '/approve'
    );

    // -------------------------------------------------------------------
    // Create member nine
    const resRegisterNine = await sendData('/api/user/register', {
        firstname: 'Beracha',
        lastname: 'Kahan',
        username: 'beracha12',
        email: 'beracha12@gmail.com',
        password: 'mountains',
        type: 'employee'
    });
    memberID = resRegisterNine.id;

    // Approve member
    const approveNine = await sendData('/api/members/' + memberID + '/approve');

    // -------------------------------------------------------------------
    // Create member ten
    const resRegisterTen = await sendData('/api/user/register', {
        firstname: 'Amadi',
        lastname: 'Tadesse',
        username: 'AmTa',
        email: 'tadessea@gmail.com',
        password: 'tuas',
        type: 'employee'
    });
    memberID = resRegisterTen.id;

    // Approve member
    const approveTen = await sendData('/api/members/' + memberID + '/approve');

    // -------------------------------------------------------------------
    // Create member eleven
    const resRegisterEleven = await sendData('/api/user/register', {
        firstname: 'Mehdi',
        lastname: 'Farrokhzad',
        username: 'mehdi93',
        email: 'mehdi93@gmail.com',
        password: 'iwishiwasamanager',
        type: 'employee'
    });
    memberID = resRegisterEleven.id;

    // Approve member
    const approveEleven = await sendData(
        '/api/members/' + memberID + '/approve'
    );

    // -------------------------------------------------------------------
    // Create member twelve
    const resRegisterTwelve = await sendData('/api/user/register', {
        firstname: 'John',
        lastname: 'Geiszler',
        username: 'geiszler75',
        email: 'johng_melbourne@gmail.com',
        password: 'bitcoin',
        type: 'employee'
    });
    memberID = resRegisterTwelve.id;

    // Approve member
    const approveTwelve = await sendData(
        '/api/members/' + memberID + '/approve'
    );

    // -------------------------------------------------------------------
    // Create member thirteen
    const resRegisterThirteen = await sendData('/api/user/register', {
        firstname: 'Nina',
        lastname: 'Toh',
        username: 'ninat',
        email: 'nin@gmail.com',
        password: 'yams',
        type: 'employee'
    });
    memberID = resRegisterThirteen.id;

    // Approve member
    const approveThirteen = await sendData(
        '/api/members/' + memberID + '/approve'
    );

    // -------------------------------------------------------------------
    // Create member fourteen
    const resRegisterFourteen = await sendData('/api/user/register', {
        firstname: 'Gbadebo',
        lastname: 'Afolabi',
        username: 'GBAF',
        email: 'gbaf@gmail.com',
        password: '98jUY34n12D',
        type: 'employee'
    });
    memberID = resRegisterFourteen.id;

    // Approve member
    const approveFourteen = await sendData(
        '/api/members/' + memberID + '/approve'
    );

    // -------------------------------------------------------------------
    // Create member fifteen
    const resRegisterFifteen = await sendData('/api/user/register', {
        firstname: 'Mi Gyeong',
        lastname: 'Song',
        username: 'misong',
        email: 'mgsong96@gmail.com',
        password: 'ilovemyoppa',
        type: 'employee'
    });
    memberID = resRegisterFifteen.id;

    // Approve member
    const approveFifteen = await sendData(
        '/api/members/' + memberID + '/approve'
    );
});
