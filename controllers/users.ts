import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { userCreate } from '../models/users';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { first_name, last_name, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = await userCreate(first_name, last_name, email, hashedPassword);
        req.login(newUser, (err) => {
            if (err) {
                console.error('Error logging in user:', err);
                res.status(500).json({ message: 'Failed to log in user' });
            } else {
                res.status(200).json({ user: req.user })
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'Failed to create user', error: (error as Error).message  });
    }
};