import express from 'express';
const router = express.Router();

// Controller and middleware imports
import * as MemberController from '../controllers/member/member';
import * as MemberActionController from '../controllers/member/member_action';
import * as AuthMiddleware from '../middleware/auth';
import * as MemberMiddleware from '../middleware/member';
import * as QueryMiddleware from '../middleware/query';
import validateID from '../middleware/id';

// Import avatar helper
import { avatar } from '../helper/avatar_upload';

// Import member post router
import MemberPostRouter from './member_post';

// Approve member
router.post(
    '/:memberID/approve',
    AuthMiddleware.isAdmin,
    MemberController.approveMember
);

// Get members
router.get('/', QueryMiddleware.parseQuery, MemberController.getMembers);

// Get one member
router.get('/:memberID', validateID('memberID'), MemberController.getMember);

// Get teams of member
router.get(
    '/:memberID/teams',
    validateID('memberID'),
    MemberMiddleware.userIsMember,
    MemberController.getTeams
);

// Get badges
router.get(
    '/:memberID/badges',
    validateID('memberID'),
    MemberController.getBadges
);

// Update member
router.put(
    '/:memberID',
    validateID('memberID'),
    MemberMiddleware.userIsMember,
    MemberActionController.updateMember
);

// Update member avatar
router.put(
    '/:memberID/avatar',
    validateID('memberID'),
    MemberMiddleware.userIsMember,
    avatar.single('avatar'),
    MemberActionController.updateMemberAvatar
);

// Member posts router
router.use('/:memberID/posts', validateID('memberID'), MemberPostRouter);

export default router;
