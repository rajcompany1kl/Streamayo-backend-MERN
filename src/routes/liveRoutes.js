import { Router } from 'express';
import * as liveController from '../controllers/liveController.js';

const router = Router();

router.get('/getallrooms', liveController.getAllLives);
router.post('/endroom/:roomId', liveController.endRoom);
router.get('/room-metadata/:roomId', liveController.getRoomMetadata);

export default router;
