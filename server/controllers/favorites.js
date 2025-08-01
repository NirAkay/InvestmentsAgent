import myModels from '../models/favorites.js'

const getFavorites = async (req, res) => {
    const myRes = await myModels.getFavoritesModels(req.headers.authorization.split(" ")[0], req.headers.authorization.split(" ")[1]);
    if (myRes === 401) {
        res.status(myRes);
    } else {
        res.status(200).send(myRes);
    }
    res.end();
}

const addToFavorites = async (req, res) => {
    const myRes = await myModels.addToFavoritesModels(req.headers.authorization.split(" ")[0], req.headers.authorization.split(" ")[1], req.params.stock, req.query.symbol);
    res.status(myRes);
    res.end();
}

const deleteFromFavorites = async (req, res) => {
    const myRes = await myModels.deleteFromFavoritesModels(req.headers.authorization.split(" ")[0], req.headers.authorization.split(" ")[1], req.params.stock, req.query.symbol);
    res.status(myRes);
    res.end();
}

export { getFavorites, addToFavorites, deleteFromFavorites };