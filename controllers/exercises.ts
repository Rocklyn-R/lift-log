import { Request, Response } from 'express';
import { categoriesGet } from "../models/exercises"

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