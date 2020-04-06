import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const router = Router();

router
  .route('/login')
  .get(AuthController.getUsers)
  .post(AuthController.login);
router.route('/registration').post(AuthController.registration);
export default router;
