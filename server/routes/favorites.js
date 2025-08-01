import express from 'express'
import { getFavorites, addToFavorites, deleteFromFavorites } from '../controllers/favorites.js'
var favoritesRouter = express.Router();

favoritesRouter.get('/', getFavorites);
favoritesRouter.post('/Add/:stock', addToFavorites);
favoritesRouter.delete('/Delete/:stock', deleteFromFavorites);

export default favoritesRouter;