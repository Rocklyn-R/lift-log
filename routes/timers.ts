import { addTimer, editTimer, getTimer, playPauseTimer } from 'controllers/timers';
import express from 'express';


const timerRouter = express.Router();

timerRouter.post('/', addTimer);

timerRouter.get('/', getTimer);

timerRouter.put('/', editTimer);

timerRouter.put('/play-pause', playPauseTimer);

export default timerRouter;