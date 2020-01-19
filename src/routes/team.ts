// Router for team related routes
import express from 'express';
const router = express.Router();

// Controller and middleware imports
import * as TeamController from '../controllers/team/team';
import * as TeamNewsController from '../controllers/team/team_news';
import * as TeamMiddleware from '../middleware/team';
import * as AuthMiddleware from '../middleware/auth';
import * as QueryMiddleware from '../middleware/query';
import validateID from '../middleware/id';

// Import avatar helper
import { avatar } from '../helper/avatar_upload';

// Import team post/thread routers
import TeamPostRouter from './team_post';
import TeamThreadRouter from './team_thread';

// Create team
router.post('/', AuthMiddleware.isAdmin, TeamController.createTeam);

// Get teams
router.get('/', QueryMiddleware.parseQuery, TeamController.getTeams);

// Get specified team
router.get(
    '/:teamID',
    validateID('teamID'),
    TeamMiddleware.getTeamMembers,
    TeamMiddleware.isMember,
    TeamController.getTeam
);

// Update team
router.put(
    '/:teamID',
    validateID('teamID'),
    TeamMiddleware.getTeamMembers,
    TeamMiddleware.isManager,
    TeamController.updateTeam
);

// Update team avatar
router.put(
    '/:teamID/avatar',
    validateID('teamID'),
    TeamMiddleware.getTeamMembers,
    TeamMiddleware.isManager,
    avatar.single('avatar'),
    TeamController.updateTeamAvatar
);

// Add member/manager
router.post(
    '/:teamID/members/add',
    validateID('teamID'),
    TeamMiddleware.getTeamMembers,
    TeamMiddleware.isManager,
    TeamController.addMember
);
// Remove member/manager
router.post(
    '/:teamID/members/remove',
    validateID('teamID'),
    TeamMiddleware.getTeamMembers,
    TeamMiddleware.isManager,
    TeamController.removeMember
);

// Add NewsItem
router.post(
    '/:teamID/news',
    validateID('teamID'),
    TeamMiddleware.getTeamMembers,
    TeamMiddleware.isManager,
    TeamNewsController.createNewsItem
);

// Award Badge
router.post(
    '/:teamID/award/badge',
    validateID('teamID'),
    TeamMiddleware.getTeamMembers,
    TeamMiddleware.isManager,
    TeamController.awardBadge
);

// Use router for post related routes
router.use(
    '/:teamID/posts',
    validateID('teamID'),
    TeamMiddleware.getTeamMembers,
    TeamMiddleware.isMember,
    TeamPostRouter
);

// Use router for thread related routes
router.use(
    '/:teamID/threads',
    validateID('teamID'),
    TeamMiddleware.getTeamMembers,
    TeamMiddleware.isMember,
    TeamThreadRouter
);

export default router;
