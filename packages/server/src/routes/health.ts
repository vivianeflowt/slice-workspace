import { Router } from 'express';
import { humanizeTime } from '../utils/humanize';
import { HTTP_STATUS_OK } from '../utils/http-status';

// Rota de healthcheck para monitoramento do servidor
const router: Router = Router();

router.get('/health', (req, res) => {
  res.status(HTTP_STATUS_OK).json({
    status: 'ok',
    uptime: humanizeTime(process.uptime()),
  });
});

export default router;
