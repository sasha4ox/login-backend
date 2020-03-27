import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const router = Router();

router.route('/login').get(AuthController.getAllAuths);
// .post(TestController.addTest);

// router.route('/:id')
//     .get(TestController.getATest)
//     .put(TestController.updatedTest)
//     .delete(TestController.deleteTest);

export default router;
