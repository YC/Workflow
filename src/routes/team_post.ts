// Router for team posts
// Adapted from https://stackoverflow.com/questions/28977253
import express from 'express';
const router = express.Router({ mergeParams: true });

// Import team post controllers and middleware
import * as TeamPostController from '../controllers/team/team_post';
import * as PostMiddleware from '../middleware/post';

// Get post
router.get('/', TeamPostController.getPosts);

// Create post
router.post('/', TeamPostController.createPost);

// Add comment
router.post(
    '/:postID',
    PostMiddleware.validateID,
    TeamPostController.addComment
);

// Add upvote
router.post(
    '/:postID/upvote',
    PostMiddleware.validateID,
    TeamPostController.upvotePost
);

// Remove upvote
router.delete(
    '/:postID/upvote',
    PostMiddleware.validateID,
    TeamPostController.removePostUpvote
);

export default router;
