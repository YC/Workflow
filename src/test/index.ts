import mongoose from 'mongoose';
import 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiHttp from 'chai-http';
chai.use(chaiAsPromised);
chai.use(chaiHttp);

// Init app
const www = require('../../build/bin/www');
const app = www.app;
export default app;

// Wait for database connection to open
before(function(done) {
    mongoose.connection.once('open', function() {
        done();
    });
});

// Clear collections before starting
before(async function() {
    await mongoose.model('Badge').remove({});
    await mongoose.model('Redeemable').remove({});
    await mongoose.model('Team').remove({});
    await mongoose.model('Member').remove({});
    await mongoose.model('Post').remove({});
    await mongoose.model('RedeemItem').remove({});
});

// Run tests
import './frontend/index';
import './api';

// Close database connection and server
after(function(done) {
    mongoose.connection.close();
    app.listen(process.env.PORT || 5000).close();
    done();
});
