import express from 'express'
import { getMessagesController, sendController, createChatController } from '../controllers/chats.js'
var chatsRouter = express.Router();

chatsRouter.post('/Send', sendController);
chatsRouter.post('/create/:user', createChatController);
//usersRouter.delete('/Delete', deleteUser);
chatsRouter.get('/:user', getMessagesController);

export default chatsRouter;