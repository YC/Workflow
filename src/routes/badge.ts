// Router for badge related routes
import express from 'express';
const router = express.Router();

// Controller and middleware imports
import * as BadgeController from '../controllers/badge';
import * as AuthMiddleware from '../middleware/auth';
import * as QueryMiddleware from '../middleware/query';
import validateID from '../middleware/id';

// Import avatar helper
import { avatar } from '../helper/avatar_upload';

// Get badges
router.get('/', QueryMiddleware.parseQuery, BadgeController.getBadges);

// Create badge
router.post('/', AuthMiddleware.isAdmin, BadgeController.createBadge);

// Get badge
router.get('/:badgeID', validateID('badgeID'), BadgeController.getBadge);

// Update badge
router.put(
    '/:badgeID',
    AuthMiddleware.isAdmin,
    validateID('badgeID'),
    BadgeController.updateBadge
);

// Update badge avatar
router.put(
    '/:badgeID/avatar',
    AuthMiddleware.isAdmin,
    validateID('badgeID'),
    avatar.single('avatar'),
    BadgeController.updateBadgeAvatar
);

export default router;
