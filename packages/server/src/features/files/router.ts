// router.ts — Feature files
// Roteador da feature files (OpenAI compatible)
// Endpoint: POST /v1/files
// Doc OpenAI: https://platform.openai.com/docs/api-reference/files

import { Router } from 'express';
import { HTTP_STATUS_NOT_IMPLEMENTED } from '../../utils/http-status';
import { asyncHandler } from '../../utils/async-handler';

const router = Router();

router.post(
  '/files',
  asyncHandler(async (req, res) => {
    res.status(HTTP_STATUS_NOT_IMPLEMENTED).json({
      error: 'Not implemented. Veja guideline OpenAI para detalhes.',
    });
  }),
);

export default router;
