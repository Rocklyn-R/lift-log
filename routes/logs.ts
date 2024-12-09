import express from 'express';
import { addToLog, getLog } from '../controllers/logs';

const logsRouter = express.Router();

logsRouter.post('/add', addToLog);

logsRouter.get('/', getLog);

export default logsRouter;