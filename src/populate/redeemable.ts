import chai from 'chai';
const expect = chai.expect;
import { getData, sendData } from './connection';

// Adds redeemables
it('Redeemable init', async function() {
    // Login as admin
    const adminLogin = await sendData('/api/user/login', {
        username: 'admin',
        password: 'admin'
    });
    expect(adminLogin).to.have.property('id');

    // -------------------------------------------------------------------
    // Create first redeemable
    const redeemableOne = await sendData('/api/redeems', {
        name: 'Github sticker',
        description: 'Sticker for laptop',
        rep: 10
    });
    expect(redeemableOne).to.have.property('id');

    // -------------------------------------------------------------------
    // Create second redeemable
    const redeemableTwo = await sendData('/api/redeems', {
        name: 'Coffee cup',
        description: 'Kofster coffee cup',
        rep: 20
    });
    expect(redeemableTwo).to.have.property('id');

    // -------------------------------------------------------------------
    // Create third redeemable
    const redeemableThree = await sendData('/api/redeems', {
        name: 'Theme park pass',
        description: 'Theme park pass to Luna world',
        rep: 50
    });
    expect(redeemableThree).to.have.property('id');

    // -------------------------------------------------------------------
    // Create fourth redeemable
    const redeemableFour = await sendData('/api/redeems', {
        name: 'Cinema pass',
        description: 'Free movie pass to Hoyts cinemas',
        rep: 40
    });
    expect(redeemableFour).to.have.property('id');

    // -------------------------------------------------------------------
    // Create fifth redeemable
    const redeemableFive = await sendData('/api/redeems', {
        name: 'Subway deal',
        description: 'Free subway foot long',
        rep: 30
    });
    expect(redeemableFive).to.have.property('id');
});
