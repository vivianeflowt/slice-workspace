// router.ts — Feature fine-tunes
// Roteador da feature fine-tunes (OpenAI compatible)
// Endpoint: POST /v1/fine-tunes
// Doc OpenAI: https://platform.openai.com/docs/api-reference/fine-tunes/create

import { Router } from 'express';
import { HTTP_STATUS_NOT_IMPLEMENTED } from '../../utils/http-status';
import { asyncHandler } from '../../utils/async-handler';

const router = Router();

router.post(
  '/fine-tunes',
  asyncHandler(async (req, res) => {
    res.status(HTTP_STATUS_NOT_IMPLEMENTED).json({
      error: 'Not implemented. Veja guideline OpenAI para detalhes.',
    });
  }),
);

export default router;
