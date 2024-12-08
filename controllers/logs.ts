import { Request, Response } from 'express';
import { toLogAdd } from '../models/logs';

interface User {
    id: number
}


export const addToLog = async (req: Request, res: Response) => {
   const { date, exercise_id, set_number, weight, reps } = req.body;
   
   const user_id = (req.user as User).id;
   console.log(date, exercise_id, set_number, weight, reps, user_id)
   
    try {
        const result = await toLogAdd(date, user_id, exercise_id, set_number, weight, reps);
        console.log(result);
        if (result) {
            res.status(201).json({ set: result})
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}