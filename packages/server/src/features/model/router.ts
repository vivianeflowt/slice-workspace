import { Router } from 'express';
import { ModelController } from './controller';
import { asyncHandler } from '../../utils/async-handler';

const modelController = new ModelController();
const modelRouter: Router = Router();

// Rota única: listagem geral, por provider ou por model via query string
modelRouter.get(
  '/',
  asyncHandler(async (req, res, next): Promise<any> => {
    if (req.query.model) {
      return modelController.findByModel(req, res, next);
    }
    if (req.query.provider) {
      return modelController.findByProvider(req, res, next);
    }
    return modelController.listAll(req, res, next);
  }),
);

export default modelRouter;
