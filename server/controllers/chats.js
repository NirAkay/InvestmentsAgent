import myModels from '../models/chats.js'

const sendController = async(req, res) => {
    const myRes = await myModels.sendMessageModel(req.headers.authorization.split(" ")[0], req.headers.authorization.split(" ")[1], req.body);
    res.status(myRes);
    res.end();
}

const createChatController = async(req, res) => {
    const myRes = await myModels.createChatModel(req.headers.authorization.split(" ")[0], req.headers.authorization.split(" ")[1], req.body);
    if (myRes == 401) {
        res.status(401);
    } else {
        res.status(200).json(myRes);
    }
    res.end();
}

const getMessagesController = async(req, res) => {
    const myRes = await myModels.getMessagesModel(req.headers.authorization.split(" ")[0], req.headers.authorization.split(" ")[1], req);
    if (myRes == 401) {
        res.status(401);
    } else {
        res.status(200).json({messages: myRes});
    }
    res.end()
}

export { sendController, getMessagesController, createChatController };