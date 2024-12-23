import e, { Request, Response } from 'express';
import { timerAdd, timerGet } from '../models/timers';

interface User {
    id: number
}

export const addTimer = async (req: Request, res: Response) => {
    const user_id = (req.user as User).id;
    const {hours, minutes, seconds, seconds_left} = req.body;
    try {
        const result = await timerAdd(user_id, hours, minutes, seconds, seconds_left);
        console.log(result);
        if (result) {
            res.status(201).json({ message: "Timer successfully added"})
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getTimer = async (req: Request, res: Response) => {
    const user_id = (req.user as User).id;
    try {
        const result = await timerGet(user_id);
        if (result) {
            //console.log(result);
            res.status(201).json({ timer: result })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}



