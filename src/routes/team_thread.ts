// Router for team threads
import express from 'express';
const router = express.Router({ mergeParams: true });

// Import team thread controllers and middleware
import * as TeamThreadController from '../controllers/team/team_thread';
import * as ThreadMiddleware from '../middleware/thread';

// Get post
router.get('/', TeamThreadController.getThreads);

// Create post
router.post('/', TeamThreadController.createThread);

// Add comment
router.post(
    '/:threadID',
    ThreadMiddleware.validateID,
    TeamThreadController.addComment
);

// Add upvote
router.post(
    '/:threadID/upvote',
    ThreadMiddleware.validateID,
    TeamThreadController.upvoteThread
);

// Remove upvote
router.delete(
    '/:threadID/upvote',
    ThreadMiddleware.validateID,
    TeamThreadController.removeThreadUpvote
);

export default router;
