import express from 'express';
import { getCategories, getExercises } from '../controllers/exercises';

const exercisesRouter = express.Router();

exercisesRouter.get('/categories', getCategories);

exercisesRouter.get('/exercises', getExercises);

export default exercisesRouter;