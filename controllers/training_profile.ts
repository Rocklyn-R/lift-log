import { Request, Response } from 'express';
import { bodyCompositionGoalSet, injuriesSet, trainingGoalSet, trainingProfileCreate, trainingProfileGet } from 'models/training_profile';

interface User {
    id: number
}

export const createTrainingProfile = async (req: Request, res: Response) => {
    const user_id = (req.user as User).id;
    try {
        const result = await trainingProfileCreate(user_id);
        if (result) {
            res.status(201).json({ message: "Training Profile created" })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getTrainingProfile = async (req: Request, res: Response) => {
    const user_id = (req.user as User).id;
    try {
        const result = await trainingProfileGet(user_id);
        if (result) {
            res.status(201).json({ trainingProfile: result })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const setTrainingGoal = async (req: Request, res: Response) => {
    const user_id = (req.user as User).id;
    const { training_goal } = req.body;
    try {
        const result = await trainingGoalSet(user_id, training_goal);
        if (result) {
            res.status(201).json({ message: "Training goal successfully updated" })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const setBodyCompositionGoal = async (req: Request, res: Response) => {
    const user_id = (req.user as User).id;
    const { body_composition_goal } = req.body;
    try {
        const result = await bodyCompositionGoalSet(user_id, body_composition_goal);
        if (result) {
            res.status(201).json({ message: "Body composition goal successfully updated" })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const setInjuries = async (req: Request, res: Response) => {
    const user_id = (req.user as User).id;
    const { injuries } = req.body;
    try {
        const result = await injuriesSet(user_id, injuries);
        if (result) {
            res.status(201).json({ message: "Injuries successfully updated" })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}