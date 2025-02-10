import { Request, Response } from 'express';
import { settingsCreate, settingsGet, unitSystemSet } from 'models/settings';

interface User {
    id: number
}

export const createSettings = async (req: Request, res: Response) => {
    const user_id = (req.user as User).id;
    try {
        const result = await settingsCreate(user_id);
        if (result) {
            res.status(201).json({ message: "Settings created" })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getSettings = async (req: Request, res: Response) => {
    const user_id = (req.user as User).id;
    try {
        const result = await settingsGet(user_id);
        if (result) {
            res.status(201).json({ settings: result })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const setUnitSystem = async (req: Request, res: Response) => {
    const user_id = (req.user as User).id;
    const { unit_system } = req.body;
    try {
        const result = await unitSystemSet(unit_system, user_id);
        if (result) {
            res.status(201).json({ message: "Unit system successfully updated" })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}