// Router for team posts
// Adapted from https://stackoverflow.com/questions/28977253
import express from 'express';
const router = express.Router({ mergeParams: true });

// Import team post controllers and middleware
import * as TeamPostController from '../controllers/team/team_post';
import validateID from '../middleware/id';

// Get post
router.get('/', TeamPostController.getPosts);

// Create post
router.post('/', TeamPostController.createPost);

// Add comment
router.post('/:postID', validateID('postID'), TeamPostController.addComment);

// Add upvote
router.post(
    '/:postID/upvote',
    validateID('postID'),
    TeamPostController.upvotePost
);

// Remove upvote
router.delete(
    '/:postID/upvote',
    validateID('postID'),
    TeamPostController.removePostUpvote
);

export default router;
