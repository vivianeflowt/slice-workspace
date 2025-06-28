// Roteador para /completions: recebe um prompt e retorna resposta da IA
// Segue padrão OpenAI: POST /completions

import { Router } from 'express';
import { ChatController } from './controller';
import { asyncHandler } from '../../utils/async-handler';

const chatController = new ChatController();
const chatRouter: Router = Router();

chatRouter.post('/completions', asyncHandler(chatController.chat.bind(chatController)));

export default chatRouter;
