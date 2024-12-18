import express from 'express';
import { createExercise, getCategories, getExercises } from '../controllers/exercises';

const exercisesRouter = express.Router();

exercisesRouter.get('/categories', getCategories);

exercisesRouter.get('/', getExercises);

exercisesRouter.post('/', createExercise);

export default exercisesRouter;