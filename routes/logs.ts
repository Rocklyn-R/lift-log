import express from 'express';
import { addToLog, deleteSet, editLog, getLog, updateSetNumber } from '../controllers/logs';

const logsRouter = express.Router();

logsRouter.post('/add', addToLog);

logsRouter.get('/', getLog);

logsRouter.put('/edit', editLog);

logsRouter.delete('/delete', deleteSet);

logsRouter.put('/edit-set-number', updateSetNumber);

export default logsRouter;