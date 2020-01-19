// Router for redeemable related routes
import express from 'express';
const router = express.Router();

// Controller and middleware imports
import * as RedeemItemController from '../controllers/redeem/redeemitem';
import * as AuthMiddleware from '../middleware/auth';
import * as QueryMiddleware from '../middleware/query';
import validateID from '../middleware/id';

// Get redeemed items
router.get(
    '/',
    AuthMiddleware.isAdmin,
    QueryMiddleware.parseQuery,
    RedeemItemController.getRedeemed
);

// Get redeemed item
router.get(
    '/:redeemItemID',
    AuthMiddleware.isAdmin,
    validateID('redeemItemID'),
    RedeemItemController.getRedeemItem
);

// Update redeemed item
router.put(
    '/:redeemItemID',
    AuthMiddleware.isAdmin,
    validateID('redeemItemID'),
    RedeemItemController.updateRedeemItem
);

export default router;
