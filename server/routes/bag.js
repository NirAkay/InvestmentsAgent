import express from 'express'
import { getBag, getBagsNames, addStockToBag, updateStockFromBag, deleteBag } from '../controllers/bag.js'
var bagRouter = express.Router();

bagRouter.get('/Names', getBagsNames);
bagRouter.post('/AddBag/:bag', addBag);
bagRouter.post('/AddStock/:bag', addStockToBag);
bagRouter.post('/updateStock/:bag', updateStockFromBag);
bagRouter.delete('/Delete/:bag', deleteBag);
bagRouter.get('/:bag', getBag);

export default bagRouter;