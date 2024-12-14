import express from 'express';
import { addToLog, changeOrder, deleteSet, editLog, getAllDates, getHistory, getLog, getPrs, updateSetNumber } from '../controllers/logs';

const logsRouter = express.Router();

logsRouter.post('/add', addToLog);

logsRouter.get('/', getLog);

logsRouter.put('/edit', editLog);

logsRouter.delete('/delete', deleteSet);

logsRouter.put('/edit-set-number', updateSetNumber);

logsRouter.get('/history', getHistory);

logsRouter.get('/prs', getPrs);

logsRouter.put('/reorder', changeOrder);

logsRouter.get('/dates', getAllDates);

export default logsRouter;