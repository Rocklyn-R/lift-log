import { createTrainingProfile, getTrainingProfile, setBodyCompositionGoal, setInjuries, setTrainingGoal } from '../controllers/training_profile';
import express from 'express';

const trainingProfileRouter = express.Router();

trainingProfileRouter.post('/', createTrainingProfile);

trainingProfileRouter.get('/', getTrainingProfile);

trainingProfileRouter.put('/training-goal', setTrainingGoal);

trainingProfileRouter.put('/body-composition-goal', setBodyCompositionGoal);

trainingProfileRouter.put('/injuries', setInjuries);

export default trainingProfileRouter;