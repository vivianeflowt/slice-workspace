// router.ts — Feature moderations
// Roteador da feature moderations (OpenAI compatible)
// Endpoint: POST /v1/moderations
// Doc OpenAI: https://platform.openai.com/docs/api-reference/moderations/create

import { Router } from 'express';
import { HTTP_STATUS_NOT_IMPLEMENTED } from '../../utils/http-status';
import { asyncHandler } from '../../utils/async-handler';

const router = Router();

router.post(
  '/moderations',
  asyncHandler(async (req, res) => {
    res.status(HTTP_STATUS_NOT_IMPLEMENTED).json({
      error: 'Not implemented. Veja guideline OpenAI para detalhes.',
    });
  }),
);

export default router;
