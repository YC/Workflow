// Adapted from:
// https://github.com/Microsoft/TypeScript-Node-Starter
// http://www.passportjs.org/docs/downloads/html/
// https://gist.github.com/dylants/8030433

// Import passport and local strategy
import passport from 'passport';
import { Strategy as LocalStrategy, IVerifyOptions } from 'passport-local';
// Import Member model
import Member from '../models/member';

// Serialise/Deserialise user
passport.serializeUser<any, any>((user, done) => {
    done(undefined, user.id);
});
passport.deserializeUser(async (obj, done) => {
    try {
        const user = await Member.findById(obj, '-posts');
        done(undefined, user);
    } catch (err) {
        done(err, undefined);
    }
});

// Defines local authentication strategy for Passport
passport.use(
    'local',
    new LocalStrategy(
        async (
            username: string,
            password: string,
            done: (error: any, user?: any, options?: IVerifyOptions) => void
        ) => {
            // Get the user by username
            const user = await Member.findOne(
                { username: username.toLowerCase() },
                { posts: 0, redeemItems: 0 }
            );
            // If there is no such user
            if (!user) {
                return done(undefined, false, {
                    message: 'Invalid username or password'
                });
            }

            // Ensure that the user is active
            if (!user.active && !user.scope.includes('admin')) {
                return done(undefined, false, {
                    message: 'User is not active'
                });
            }

            // Compare the password
            user.comparePassword(password, (err: Error, valid: boolean) => {
                // If passwords could not be compared
                if (err) {
                    return done(undefined, false, {
                        message: 'Invalid username or password'
                    });
                }

                if (valid) {
                    // If the password matches
                    return done(undefined, user);
                } else {
                    // If the password doesn't match
                    return done(undefined, false, {
                        message: 'Invalid username or password'
                    });
                }
            });
        }
    )
);
