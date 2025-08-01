import express from 'express'
import { returnStock, searchStock } from '../controllers/stocks.js'
var stocksRouter = express.Router();

stocksRouter.get('/:stock', returnStock);
stocksRouter.get('/Search/:stock', searchStock);

export default stocksRouter;