// Router for search related routes
import express from 'express';
const router = express.Router();

// Import controller and middleware
import * as SearchController from '../controllers/search';
import * as AuthMiddleware from '../middleware/auth';

// Search route
router.get('/', AuthMiddleware.isAuthenticated, SearchController.search);

export default router;
