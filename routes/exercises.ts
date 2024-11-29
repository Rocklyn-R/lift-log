import express from 'express';
import { getCategories } from '../controllers/exercises';

const exercisesRotuer = express.Router();

exercisesRotuer.get('/categories', getCategories);

export default exercisesRotuer;