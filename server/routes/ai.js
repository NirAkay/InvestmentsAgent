import express from 'express'
import { getStockAdvice } from '../controllers/ai.js'
var aiRouter = express.Router();

aiRouter.get('/:stock', getStockAdvice);

export default aiRouter;