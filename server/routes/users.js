import express from 'express'
import { addUser, returnUser, deleteUser, resetUser } from '../controllers/users.js'
var usersRouter = express.Router();

usersRouter.post('/', addUser);
usersRouter.delete('/Delete', deleteUser);
usersRouter.post('/Reset', resetUser);
usersRouter.get('/:user', returnUser);

export default usersRouter;