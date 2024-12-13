import e, { Request, Response } from 'express';
import { historyGet, logEdit, logGet, prsGet, setDelete, setNumberUpdate, toLogAdd } from '../models/logs';

interface User {
    id: number
}


export const addToLog = async (req: Request, res: Response) => {
   const { date, exercise_id, set_number, weight, reps, exercise_order } = req.body;
   
   const user_id = (req.user as User).id;
   
    try {
        const result = await toLogAdd(date, user_id, exercise_id, set_number, weight, reps, exercise_order);
        console.log(result);
        if (result) {
            res.status(201).json({ set: result})
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getLog = async (req: Request, res: Response) => {
    const date = req.query.date as string;
    const user_id = (req.user as User).id;
    try {
        const result = await logGet(date, user_id);
        if (result) {
            res.status(201).json({ workout: result})
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const editLog = async (req: Request, res: Response) => {
    const user_id = (req.user as User).id;
    const {weight, reps, set_id} = req.body
    try {
        const result = await logEdit(weight, reps, set_id, user_id);
        if (result) {
            res.status(201).json({ updatedSet: result })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const deleteSet = async (req: Request, res: Response) => {
    const user_id = (req.user as User).id;
    const {set_id} = req.body
    try {
        const result = await setDelete(set_id, user_id);
        if (result) {
            res.status(201).json({ setData: result })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const updateSetNumber = async (req: Request, res: Response) => {
    const user_id = (req.user as User).id;
    const {set_id} = req.body;
    try {
        const result = await setNumberUpdate(set_id, user_id);
        if (result) {
            res.status(201).json({ message: "Set number updated"})
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getHistory = async (req: Request, res: Response) => {
    const user_id = (req.user as User).id;
    const exercise_id_string = req.query.exercise_id as string;
    const exercise_id = Number(exercise_id_string);
    try {
        const result = await historyGet(user_id, exercise_id);
        if (result) {
            res.status(201).json({ history: result })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getPrs = async (req: Request, res: Response) => {
    const user_id = (req.user as User).id;
    const exercise_id_string = req.query.exercise_id as string;
    const exercise_id = Number(exercise_id_string);
    const date = req.query.date as string;

    try {
        const result = await prsGet(user_id, exercise_id, date);
        if (result) {
            res.status(201).json({ prData: result })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}