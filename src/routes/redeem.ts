// Router for redeemable related routes
import express from 'express';
const router = express.Router();

// Controller and middleware imports
import * as RedeemableController from '../controllers/redeem/redeemable';
import * as AuthMiddleware from '../middleware/auth';
import * as QueryMiddleware from '../middleware/query';
import validateID from '../middleware/id';

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
    validateID('redeemableID'),
    RedeemableController.getRedeemable
);

// Update redeemable
router.put(
    '/:redeemableID',
    AuthMiddleware.isAdmin,
    validateID('redeemableID'),
    RedeemableController.updateRedeemable
);

export default router;
