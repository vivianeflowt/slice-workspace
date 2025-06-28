import { Router } from 'express';
import modelRouter from '../features/model/router';

const router: Router = Router();
router.use('/', modelRouter);

export default router;
