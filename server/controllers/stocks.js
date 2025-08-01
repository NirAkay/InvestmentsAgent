import myModels from '../models/stocks.js'

const returnStock = async (req, res) => {
    const myRes = await myModels.returnStockModels(req.headers.authorization.split(" ")[0], req.headers.authorization.split(" ")[1], req.params.stock, req.query.timeLine, req.query.interval, req.query.symbol);
    if (myRes === 401) {
        res.status(myRes);
    } else {
        res.status(200).send(myRes);
    }
    res.end();
}

const searchStock = async (req, res) => {
    const myRes = await myModels.searchStockModels(req.headers.authorization.split(" ")[0], req.headers.authorization.split(" ")[1], req.params.stock);
    if (myRes === 401) {
        res.status(myRes);
    } else {
        res.status(200).send(myRes);
    }
    res.end();
}


export { returnStock, searchStock };