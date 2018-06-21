// Router for team related routes
import express from 'express';
const router = express.Router();

// Controller and middleware imports
import * as TeamController from '../controllers/team/team';
import * as TeamNewsController from '../controllers/team/team_news';
import * as TeamMiddleware from '../middleware/team';
import * as AuthMiddleware from '../middleware/auth';
import * as QueryMiddleware from '../middleware/query';

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
    TeamMiddleware.validateID,
    TeamMiddleware.getTeamMembers,
    TeamMiddleware.isMember,
    TeamController.getTeam
);

// Update team
router.put(
    '/:teamID',
    TeamMiddleware.validateID,
    TeamMiddleware.getTeamMembers,
    TeamMiddleware.isManager,
    TeamController.updateTeam
);

// Update team avatar
router.put(
    '/:teamID/avatar',
    TeamMiddleware.validateID,
    TeamMiddleware.getTeamMembers,
    TeamMiddleware.isManager,
    avatar.single('avatar'),
    TeamController.updateTeamAvatar
);

// Add member/manager
router.post(
    '/:teamID/members/add',
    TeamMiddleware.validateID,
    TeamMiddleware.getTeamMembers,
    TeamMiddleware.isManager,
    TeamController.addMember
);
// Remove member/manager
router.post(
    '/:teamID/members/remove',
    TeamMiddleware.validateID,
    TeamMiddleware.getTeamMembers,
    TeamMiddleware.isManager,
    TeamController.removeMember
);

// Add NewsItem
router.post(
    '/:teamID/news',
    TeamMiddleware.validateID,
    TeamMiddleware.getTeamMembers,
    TeamMiddleware.isManager,
    TeamNewsController.createNewsItem
);

// Award Badge
router.post(
    '/:teamID/award/badge',
    TeamMiddleware.validateID,
    TeamMiddleware.getTeamMembers,
    TeamMiddleware.isManager,
    TeamController.awardBadge
);

// Use router for post related routes
router.use(
    '/:teamID/posts',
    TeamMiddleware.validateID,
    TeamMiddleware.getTeamMembers,
    TeamMiddleware.isMember,
    TeamPostRouter
);

// Use router for thread related routes
router.use(
    '/:teamID/threads',
    TeamMiddleware.validateID,
    TeamMiddleware.getTeamMembers,
    TeamMiddleware.isMember,
    TeamThreadRouter
);

export default router;
