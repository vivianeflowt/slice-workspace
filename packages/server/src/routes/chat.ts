import { Router, Router as ExpressRouter } from 'express';
import chatRouter from '../features/chat/router';

const router: ExpressRouter = Router();
router.use('/', chatRouter);

export default router;
