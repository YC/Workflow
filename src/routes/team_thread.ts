// Router for team threads
import express from 'express';
const router = express.Router({ mergeParams: true });

// Import team thread controllers and middleware
import * as TeamThreadController from '../controllers/team/team_thread';
import validateID from '../middleware/id';

// Get post
router.get('/', TeamThreadController.getThreads);

// Create post
router.post('/', TeamThreadController.createThread);

// Add comment
router.post(
    '/:threadID',
    validateID('threadID'),
    TeamThreadController.addComment
);

// Add upvote
router.post(
    '/:threadID/upvote',
    validateID('threadID'),
    TeamThreadController.upvoteThread
);

// Remove upvote
router.delete(
    '/:threadID/upvote',
    validateID('threadID'),
    TeamThreadController.removeThreadUpvote
);

export default router;
