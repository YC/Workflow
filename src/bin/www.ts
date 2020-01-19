#!/usr/bin/env node
// Express initialisation adapted from:
// https://github.com/expressjs/generator/blob/master/templates/js/www.ejs
// Licensed under MIT
import http, { Server } from 'http';
import mongoose, { Connection } from 'mongoose';
import app from '../app';

// Connect to MongoDB
// Adapted from: http://mongoosejs.com/docs/index.html
mongoose.connect(
    process.env.MONGO_URL || 'mongodb://localhost:27017/workflow',
    {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }
);
const db: Connection = mongoose.connection;
db.on('error', function(err: any) {
    console.error(err);
    process.exit(1);
});
db.once('open', function() {
    // @ts-ignore: property missing errors for db.host db.port
    console.log('Mongo connection started on ' + db.host + ':' + db.port);
});

// Get port from Node environment and set provided port
const port: string = process.env.PORT || '5000';
app.set('port', port);

// Create HTTP server
const server: Server = http.createServer(app);

// Listen for HTTP requests on provided port
server.listen(port);
server.on('listening', function() {
    const addr = server.address();
    const bind =
        typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('Express listening on ' + bind);
});

// Event listener for HTTP server "error" event
server.on('error', function(err: any) {
    if (err.syscall !== 'listen') {
        throw err;
    }
    const bind: string =
        typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // Handle specific errors with friendly messages
    switch (err.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw err;
    }
});
export { app };
