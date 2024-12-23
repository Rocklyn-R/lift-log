import { addTimer, getTimer } from 'controllers/timers';
import express from 'express';


const timerRouter = express.Router();

timerRouter.post('/', addTimer);

timerRouter.get('/', getTimer);

export default timerRouter;