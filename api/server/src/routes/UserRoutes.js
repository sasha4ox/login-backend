import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

router.route('/:id').put(UserController.updateUser);
router.route('/').get(UserController.getUserProfile);
router.route('/password/:id').put(UserController.changePassword);

export default router;
