import e, { Request, Response } from 'express';
import { timerAdd, timerEdit, timerGet, timerPlayPause } from '../models/timers';

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

export const editTimer = async (req: Request, res: Response) => {
    const user_id = (req.user as User).id;
    const { hours, minutes, seconds, seconds_left } = req.body;
    try {
        const result = await timerEdit(hours, minutes, seconds, seconds_left, user_id);
        if (result) {
            res.status(201).json({ message: "Timer successfully updated" })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}


export const playPauseTimer = async (req: Request, res: Response) => {
    const user_id = (req.user as User).id;
    const { runningBoolean } = req.body;
    try {
        const result = await timerPlayPause(runningBoolean, user_id);
        if (result) {
            res.status(201).json({ message: "Timer successfully updated" })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}
