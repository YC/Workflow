import express from 'express';
const router = express.Router();
import * as HomeController from '../controllers/home';
import * as AuthMiddleware from '../middleware/auth';

// Home/index controller
router.get('/', HomeController.getIndex);

export default router;
