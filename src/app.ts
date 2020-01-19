import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';

// Passport imports
import session from 'express-session';
import ConnectMongo from 'connect-mongo';
const MongoStore = ConnectMongo(session);
import passport from 'passport';
import mongo_sanitize from 'mongo-sanitize';
import ErrorStatus from './helper/error';

// Initalise Mongoose models
import './models';

// Init express
const app = express();

// Init passport
import './helper/auth';

// Session and security
if (!process.env.SESSION_SECRET) {
    console.error('Warning: Session secret not set');
}
const session_config: any = {
    secret: process.env.SESSION_SECRET || 'default',
    resave: true,
    saveUninitialized: true,
    cookie: {},
    store: new MongoStore({ mongooseConnection: mongoose.connection })
};
// Adapted from https://github.com/YC/linksaver/blob/master/app.js
// Force security on production
if (process.env.NODE_ENV == 'production') {
    // Ensure that cookies are sent over https
    session_config.cookie.secure = true;

    // Redirect http to https
    app.enable('trust proxy');
    app.use(function(req: Request, res: Response, next: NextFunction) {
        if (!req.secure && req.get('x-forwarded-proto') != 'https') {
            return res.redirect('https://' + req.get('host') + req.url);
        }
        next();
    });
}

// Set up bodyParser for form data on requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Sanitizes object recursively
const sanitize = (obj: any) => {
    mongo_sanitize(obj);
    for (const key of Object.keys(obj)) {
        if (obj[key] instanceof Object) {
            sanitize(obj[key]);
        }
    }
    return obj;
};
// Sanitize requests
app.use((req: Request, res: Response, next: NextFunction) => {
    req.body = sanitize(req.body);
    req.query = sanitize(req.query);
    req.params = sanitize(req.params);
    return next();
});

// Passport setup
app.use(session(session_config));
app.use(passport.initialize());
app.use(passport.session());

// Enable helmet, which set HTTP headers (for security)
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                'https://fonts.googleapis.com'
            ],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: [
                'https://source.unsplash.com',
                'https://images.unsplash.com',
                "'self'",
                'data:'
            ]
        }
    })
);

// Serve react app directory
app.use(express.static(path.join(__dirname, 'app')));
// Serve admin app directory
app.use(express.static(path.join(__dirname, 'admin')));

// Set up CORs
if (!process.env.CORS_ORIGIN) {
    console.error('Warning: CORS origin not set');
}
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
    exposedHeaders: ['Content-Range']
};

// Initialise API routes
import mainRouter from './routes';
app.use('/api', cors(corsOptions), mainRouter);

// Serve avatars
app.use(
    '/uploads/avatars',
    cors(corsOptions),
    express.static(path.join(__dirname, 'uploads', 'avatars'))
);

// Admin app for react
app.get('/admin*', function(req: Request, res: Response) {
    return res.sendFile(path.join(__dirname, 'admin/index.html'));
});

// React
// Adapted from 'Hosting React and a REST API with Express'
app.get('*', function(req: Request, res: Response) {
    return res.sendFile(path.join(__dirname, 'app/index.html'));
});

// Catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
    const err = new ErrorStatus('Not Found', 404);
    next(err);
});

// Error handler
// Adapted from express-generator code - Licensed under MIT
// eslint-disable-next-line no-unused-vars
app.use(function(
    err: ErrorStatus,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Set locals, only providing error in development
    const response: { message?: String; stack?: String } = {};
    response.message = err.message;
    if (req.app.get('env') === 'development') {
        response.stack = err.stack;
    }

    // If internal server error, print error
    if (!err.status) {
        console.error(err.stack);
    }

    // Return error response
    res.status(err.status || 500);
    res.json(response);
});

// Initiate cron jobs
import './helper/cron';

export default app;
