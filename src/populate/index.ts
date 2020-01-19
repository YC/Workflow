import 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiAsPromised from 'chai-as-promised';
import mongoose from 'mongoose';

// Get server and database URL
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5001';
const MONGO_URL = process.env.MONGO_URL || 'Local';
export { SERVER_URL };

// Print out connection information
console.log(`Server URL: ${SERVER_URL}`);
console.log(`Database URL: ${MONGO_URL}`);

// Init local server
// Note: The local server is used to connect to the remote database but is also
// used to populate the development database when developing locally
const www = require('../../build/bin/www');
const app = www.app;
export default app;

// Wait for a database connection to open
before(function(done) {
    mongoose.connection.once('open', function() {
        done();
    });
});

// Clear collections before starting
before(async function() {
    await mongoose.model('Badge').deleteMany({});
    await mongoose.model('Redeemable').deleteMany({});
    await mongoose.model('Team').deleteMany({});
    await mongoose.model('Member').deleteMany({});
    await mongoose.model('Post').deleteMany({});
    await mongoose.model('RedeemItem').deleteMany({});
});

// Import scripts
import './member';
import './badge';
import './member_post';
import './member_team';
import './redeemable';
import './team_badge';
import './team_news';
import './team_post';
import './team_thread';

// Close database connection and server
after(function(done) {
    mongoose.connection.close();
    done();
});
