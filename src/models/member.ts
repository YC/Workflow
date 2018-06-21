import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import bcrypt from 'bcryptjs';
import BadgeItem, { IBadgeItem } from './badgeitem';

// Password salt factor
const SALT_FACTOR: number = 10;

// Schema for user
// Adapted from:
// http://mongoosejs.com/docs/schematypes.html
// https://stackoverflow.com/questions/37711302/
const memberSchema = new mongoose.Schema(
    {
        // Authentication fields
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        scope: [{ type: String }],

        // Description fields
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, required: true },
        type: { type: String, enum: ['employee', 'contractor'] },
        bio: { type: String },
        avatar: { type: String },

        // Whether the user's account is active
        // Newly registered users' accounts are inactive by default
        // and require admin approval
        active: { type: Boolean, default: false },

        // Posts and badges
        posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
        badges: [BadgeItem.schema],

        // Reputation related fields
        rep: {
            type: Number,
            required: true,
            default: 0,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} must be an Integer'
            }
        },
        redeemItems: [{ type: Schema.Types.ObjectId, ref: 'RedeemItem' }]
    },
    { timestamps: true }
);

memberSchema.set('toObject', { virtuals: true });
memberSchema.set('toJSON', {
    virtuals: true,
    // Do not return the password hash or the rep of the user by default
    transform: function(doc: any, ret: any, options: any) {
        delete ret.password;
        delete ret.rep;
        return ret;
    }
});

// Interface for member
interface IMember {
    username: string;
    password: string;
    email: string;

    firstname: string;
    lastname: string;
    type: string;
    bio: string;
    avatar?: string;

    scope: string[];

    active: boolean;
    posts: [mongoose.Types.ObjectId];
    badges: [IBadgeItem];

    rep: number;
    redeemItems: [mongoose.Types.ObjectId];

    comparePassword: ComparePasswordFunction;
}

// Adapted from https://github.com/Microsoft/TypeScript-Node-Starter
// Type for password comparison function
type ComparePasswordFunction = (
    password: string,
    callback: (err: Error, valid: boolean) => void
) => void;

// Password comparison function
// Compares the provided password with the stored password
const comparePassword: ComparePasswordFunction = function(password, callback) {
    bcrypt.compare(
        password,
        this.password,
        (err: mongoose.Error, valid: boolean) => {
            callback(err, valid);
        }
    );
};
memberSchema.methods.comparePassword = comparePassword;

// Hash password befor saving
// Adapted from https://github.com/Microsoft/TypeScript-Node-Starter
memberSchema.pre('save', function save(next) {
    const user: any = this;

    // Go to next if password field has not been modified
    if (!user.isModified('password')) {
        return next();
    }

    // Generate a salt of the password
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        // Return on error
        if (err) {
            return next(err);
        }

        // Use generated salt to hash password
        bcrypt.hash(user.password, salt, (err: mongoose.Error, hash) => {
            if (err) {
                return next(err);
            }
            // Replace password with hash
            user.password = hash;
            next();
        });
    });
});

// Initalise model and export
interface IMemberModel extends IMember, mongoose.Document {}
const Member = mongoose.model<IMemberModel>('Member', memberSchema);
export default Member;
