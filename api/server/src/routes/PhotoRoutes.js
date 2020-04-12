import { Router } from 'express';
import PhotoController from '../controllers/PhotoController';

const router = Router();

router.route('/upload').post(PhotoController.upload);
export default router;
