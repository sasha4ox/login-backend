import { Router } from 'express';
import { check } from 'express-validator';
import AuthController from '../controllers/AuthController';

const router = Router();
function validationLogin() {
  return [check('email').isEmail(), check('password').isLength({ min: 5 })];
}
function validationRegistration() {
  return [
    check('email').isEmail(),
    check('password').isLength({ min: 5 }),
    check('userName').isLength({ min: 1 }),
  ];
}
router
  .route('/login')
  .get(AuthController.getUsers)
  .post(validationLogin(), AuthController.login);
router
  .route('/registration')
  .post(validationRegistration(), AuthController.registration);
export default router;
