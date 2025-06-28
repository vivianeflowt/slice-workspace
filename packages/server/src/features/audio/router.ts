// router.ts — Feature audio
// Roteador da feature audio (transcriptions, translations, OpenAI compatible)
// Inicialmente vazio. Importe handlers incrementais conforme guideline.

import { Router } from 'express';
import { HTTP_STATUS_NOT_IMPLEMENTED } from '../../utils/http-status';
import { asyncHandler } from '../../utils/async-handler';

const router = Router();

router.post(
  '/audio/transcriptions',
  asyncHandler(async (req, res) => {
    res.status(HTTP_STATUS_NOT_IMPLEMENTED).json({
      error: 'Not implemented. Veja guideline OpenAI para detalhes.',
    });
  }),
);

router.post(
  '/audio/translations',
  asyncHandler(async (req, res) => {
    res.status(HTTP_STATUS_NOT_IMPLEMENTED).json({
      error: 'Not implemented. Veja guideline OpenAI para detalhes.',
    });
  }),
);

export default router;
