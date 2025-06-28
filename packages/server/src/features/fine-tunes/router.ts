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

// Endpoint: GET /v1/fine-tunes
// Doc OpenAI: https://platform.openai.com/docs/api-reference/fine-tunes/list
router.get(
  '/fine-tunes',
  asyncHandler(async (req, res) => {
    res.status(HTTP_STATUS_NOT_IMPLEMENTED).json({
      error: 'Not implemented. Veja guideline OpenAI para detalhes.',
    });
  }),
);

// Endpoint: GET /v1/fine-tunes/:fine_tune_id
// Doc OpenAI: https://platform.openai.com/docs/api-reference/fine-tunes/retrieve
router.get(
  '/fine-tunes/:fine_tune_id',
  asyncHandler(async (req, res) => {
    res.status(HTTP_STATUS_NOT_IMPLEMENTED).json({
      error: 'Not implemented. Veja guideline OpenAI para detalhes.',
    });
  }),
);

// Endpoint: GET /v1/fine-tunes/:fine_tune_id/events
// Doc OpenAI: https://platform.openai.com/docs/api-reference/fine-tunes/events
router.get(
  '/fine-tunes/:fine_tune_id/events',
  asyncHandler(async (req, res) => {
    res.status(HTTP_STATUS_NOT_IMPLEMENTED).json({
      error: 'Not implemented. Veja guideline OpenAI para detalhes.',
    });
  }),
);

// Endpoint: POST /v1/fine-tunes/:fine_tune_id/cancel
// Doc OpenAI: https://platform.openai.com/docs/api-reference/fine-tunes/cancel
router.post(
  '/fine-tunes/:fine_tune_id/cancel',
  asyncHandler(async (req, res) => {
    res.status(HTTP_STATUS_NOT_IMPLEMENTED).json({
      error: 'Not implemented. Veja guideline OpenAI para detalhes.',
    });
  }),
);

export default router;
