import { Router } from 'express';
import { HTTP_STATUS_NOT_IMPLEMENTED } from '../../utils/http-status';
import { asyncHandler } from '../../utils/async-handler';

// router.ts — Feature completions
// Roteador da feature completions (OpenAI compatible)
// Endpoint: POST /v1/completions
// Doc OpenAI: https://platform.openai.com/docs/api-reference/completions/create

const router = Router();

router.post(
  '/completions',
  asyncHandler(async (req, res) => {
    res.status(HTTP_STATUS_NOT_IMPLEMENTED).json({
      error: 'Not implemented. Veja guideline OpenAI para detalhes.',
    });
  }),
);

export default router;
