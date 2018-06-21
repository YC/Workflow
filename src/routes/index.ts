import express from 'express';
const router = express.Router();

// Import routers
import homeRouter from './home';
import badgeRouter from './badge';
import redeemRouter from './redeem';
import redeemedRouter from './redeemed';
import teamRouter from './team';
import memberRouter from './member';
import userRouter from './user';
import searchRouter from './search';

// Import authentication middleware
import * as AuthMiddleware from '../middleware/auth';

// Home router
router.use('/', homeRouter);

// Create routes that need authentication
// Badge router
router.use('/badges', AuthMiddleware.isAuthenticated, badgeRouter);

// Redeem routers
router.use('/redeems', AuthMiddleware.isAuthenticated, redeemRouter);
router.use('/redeemed', AuthMiddleware.isAuthenticated, redeemedRouter);

// Team router
router.use('/teams', AuthMiddleware.isAuthenticated, teamRouter);

// Member router
router.use('/members', AuthMiddleware.isAuthenticated, memberRouter);

// User/search router
router.use('/user', userRouter);
router.use('/search', searchRouter);

export default router;
