import { addTimer, editTimer, getTimer } from 'controllers/timers';
import express from 'express';


const timerRouter = express.Router();

timerRouter.post('/', addTimer);

timerRouter.get('/', getTimer);

timerRouter.put('/', editTimer);

export default timerRouter;