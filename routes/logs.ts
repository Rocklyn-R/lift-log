import express from 'express';
import { addToLog, changeOrder, deleteAllSets, deleteExerciseFromLog, deleteSet, editLog, getAllDates, getHistory, getLog, getPrs, updatePr, updateSetNumber } from '../controllers/logs';

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

logsRouter.delete('/delete-all-sets', deleteAllSets);

logsRouter.put('/pr-update', updatePr);

logsRouter.delete('/delete-log-exercise', deleteExerciseFromLog);


export default logsRouter;