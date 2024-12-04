import express from 'express';
import { createUser } from '../controllers/users';

const usersRouter = express.Router();

usersRouter.post('/signup', createUser);


export default usersRouter;