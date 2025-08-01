import myModels from '../models/ai.js'

const getStockAdvice = async(req, res) => {
    const myRes = await myModels.getStockAdviceModel(req.headers.authorization.split(" ")[0], req.headers.authorization.split(" ")[1], req.params.stock);
    if (myRes == 401) {
        res.status(401);
    } else {
        res.status(200).json(myRes);
    }
    res.end();
}

export { getStockAdvice };