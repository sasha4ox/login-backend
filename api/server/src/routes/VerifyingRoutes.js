import { Router } from 'express';
import VerifyingController from '../controllers/VerifyingController';

const router = Router();

router.route('/').post(VerifyingController.verifying);
export default router;
