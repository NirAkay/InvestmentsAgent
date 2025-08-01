import myModels from '../models/bag.js'

const getBag = async(req, res) => {
    const myRes = await myModels.getBagModel(req.headers.authorization.split(" ")[0], req.headers.authorization.split(" ")[1], req.params.bag);
    if (myRes == 401) {
        res.status(401);
    } else {
        res.status(200).json(myRes);
    }
    res.end();
}

const getBagsNames = async(req, res) => {
    const myRes = await myModels.getBagsNamesModel(req.headers.authorization.split(" ")[0], req.headers.authorization.split(" ")[1]);
    if (myRes == 401) {
        res.status(401);
    } else {
        res.status(200).json(myRes);
    }
    res.end();
}

const addBag = async(req, res) => {
    const myRes = await myModels.addBagModel(req.headers.authorization.split(" ")[0], req.headers.authorization.split(" ")[1], req.params.bag);
    res.status(myRes);
    res.end();
}

const addStockToBag = async(req, res) => {
    const myRes = await myModels.addStockToBagModel(req.headers.authorization.split(" ")[0], req.headers.authorization.split(" ")[1], req.params.bag, req.body);
    res.status(myRes);
    res.end();
}

const updateStockFromBag = async(req, res) => {
    const myRes = await myModels.updateStockFromBagModel(req.headers.authorization.split(" ")[0], req.headers.authorization.split(" ")[1], req.params.bag, req.body);
    res.status(myRes);
    res.end();
}

const deleteBag = async(req, res) => {
    const myRes = await myModels.deleteBagModel(req.headers.authorization.split(" ")[0], req.headers.authorization.split(" ")[1], req.params.bag);
    res.status(myRes);
    res.end();
}

export { getBag, getBagsNames, addStockToBag, addBag, updateStockFromBag, deleteBag };