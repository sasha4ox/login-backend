import { Router } from 'express';
import ConfirmationEmailController from '../controllers/ConfirmationEmailController';

const router = Router();

router.route('/').patch(ConfirmationEmailController.confirmation);
export default router;
