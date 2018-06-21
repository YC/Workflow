import express from 'express';
const router = express.Router({ mergeParams: true });

// Import member post controller and middleware
import * as MemberPostController from '../controllers/member/member_post';
import * as MemberMiddleware from '../middleware/member';
import * as PostMiddleware from '../middleware/post';
import upload from '../helper/pic_upload';

// Get post
router.get('/', MemberPostController.getPosts);

// Create post
router.post(
    '/',
    MemberMiddleware.userIsNotMember,
    upload.array('files[]', 12),
    MemberPostController.createPost
);

// Add comment
router.post(
    '/:postID',
    PostMiddleware.validateID,
    MemberPostController.addComment
);

// Add upvote
router.post(
    '/:postID/upvote',
    PostMiddleware.validateID,
    MemberPostController.upvotePost
);

// Remove upvote
router.delete(
    '/:postID/upvote',
    PostMiddleware.validateID,
    MemberPostController.removePostUpvote
);

export default router;
