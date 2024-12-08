import express from 'express';
import { addToLog } from '../controllers/logs';

const logsRouter = express.Router();

logsRouter.post('/add', addToLog);

//logRouter.get('/exercises', getExercises);

export default logsRouter;