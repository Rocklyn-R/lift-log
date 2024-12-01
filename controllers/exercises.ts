import { Request, Response } from 'express';
import { categoriesGet, exercisesGet } from "../models/exercises"

export const getCategories = async (req: Request, res: Response) => {
    try {
        const result = await categoriesGet();
        if (result) {
            res.status(201).json({ categories: result})
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getExercises = async (req: Request, res: Response) => {
    const { category_id } = req.query;
    const id = category_id as string;
    try {
        const result = await exercisesGet(id);
        if (result) {
            res.status(201).json({ exercises: result})
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}