import { Router } from 'express';
import { HTTP_STATUS_NOT_IMPLEMENTED } from '../../utils/http-status';
import { asyncHandler } from '../../utils/async-handler';

// router.ts — Feature images
// Roteador da feature images (OpenAI compatible)
// Endpoint: POST /v1/images/generations
// Doc OpenAI: https://platform.openai.com/docs/api-reference/images/create

const router = Router();

router.post(
  '/images/generations',
  asyncHandler(async (req, res) => {
    res.status(HTTP_STATUS_NOT_IMPLEMENTED).json({
      error: 'Not implemented. Veja guideline OpenAI para detalhes.',
    });
  }),
);

export default router;
