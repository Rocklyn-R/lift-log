import express from 'express';
import { addDefaultsToLibrary, createExercise, deleteExercise, getCategories, getDefaultExercises, getExercises, updateExercise } from '../controllers/exercises';

const exercisesRouter = express.Router();

exercisesRouter.get('/categories', getCategories);

exercisesRouter.get('/', getExercises);

exercisesRouter.post('/', createExercise);

exercisesRouter.post('/defaults', addDefaultsToLibrary);

exercisesRouter.put('/', updateExercise);

exercisesRouter.delete('/', deleteExercise);

export default exercisesRouter;