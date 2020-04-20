import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

router
  .route('/:id')
  .patch(UserController.updateUser)
  .get(UserController.getUserProfile);
router.route('/all/:params').get(UserController.getAllusers);
// router.route('/all').post(UserController.searchUser);
router.route('/password/:id').patch(UserController.changePassword);

export default router;
