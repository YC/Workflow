// Router for user related routes
import express from 'express';
const router = express.Router();

// Import user and member controllers
import * as UserController from '../controllers/user';
import * as MemberController from '../controllers/member/member';
import * as AuthMiddleware from '../middleware/auth';

// Create member
router.post('/register', MemberController.createMember);

// Login
router.post('/login', UserController.login);

// Logout
router.get('/logout', UserController.logout);

// Session restoration
router.get('/session', AuthMiddleware.isAuthenticated, UserController.session);

// Get redeems
router.get(
    '/redeems',
    AuthMiddleware.isAuthenticated,
    UserController.getUserRedeems
);

// Redeem item
router.post('/redeem', UserController.redeemItem);

export default router;
