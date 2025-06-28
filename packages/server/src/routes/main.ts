import healthRoutes from './health';
import modelsRouter from './models';
import chatRouter from './chat';

import { Router } from 'express';
const router: Router = Router();

router.use('/health', healthRoutes);
router.use('/models', modelsRouter);
router.use('/chat', chatRouter);

export default router;
