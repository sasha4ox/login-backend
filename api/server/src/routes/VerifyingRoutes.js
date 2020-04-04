import { Router } from 'express';
import VerifyingController from '../controllers/VerifyingController';

const router = Router();

router.route('/').get(VerifyingController.verifying);
export default router;
