import { Request, Response } from 'express';
import { categoriesGet, exerciseCreate, exercisesGet } from "../models/exercises"

interface User {
    id: number
}

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
    const user_id = (req.user as User).id;
    try {
        const result = await exercisesGet(id, user_id);
        if (result) {
            res.status(201).json({ exercises: result})
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const createExercise = async (req: Request, res: Response) => {
    const { name, category, type } = req.body;
    const user_id = (req.user as User).id;
    try {
        const result = await exerciseCreate(name, category, type, user_id);
        if (result) {
            res.status(201).json({ exercises: result})
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}