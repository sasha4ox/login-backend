import { Router } from 'express';
import AdminController from '../controllers/AdminController';

const router = Router();

router.route('/:id').patch(AdminController.updateUser);
router.route('/search/:params').get(AdminController.searchUsers);

export default router;
