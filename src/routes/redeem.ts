// Router for redeemable related routes
import express from 'express';
const router = express.Router();

// Controller and middleware imports
import * as RedeemableController from '../controllers/redeem/redeemable';
import * as RedeemItemController from '../controllers/redeem/redeemitem';
import * as AuthMiddleware from '../middleware/auth';
import * as QueryMiddleware from '../middleware/query';
import * as RedeemableMiddleware from '../middleware/redeem';

// Get redeemables
router.get(
    '/',
    QueryMiddleware.parseQuery,
    RedeemableController.getRedeemables
);

// Create redeemable
router.post('/', AuthMiddleware.isAdmin, RedeemableController.createRedeemable);

// Get redeemable
router.get(
    '/:redeemableID',
    RedeemableMiddleware.validateID,
    RedeemableController.getRedeemable
);

// Update redeemable
router.put(
    '/:redeemableID',
    AuthMiddleware.isAdmin,
    RedeemableMiddleware.validateID,
    RedeemableController.updateRedeemable
);

export default router;
