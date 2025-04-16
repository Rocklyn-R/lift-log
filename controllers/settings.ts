import { Request, Response } from 'express';
import { effortScaleSet, emailChangeConfirm, pendingEmailSet, settingsCreate, settingsGet, themeSet, unitSystemSet } from '../models/settings';
import nodemailer from 'nodemailer';
import { randomUUID } from 'crypto';

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

export const setEffortScale = async (req: Request, res: Response) => {
    const user_id = (req.user as User).id;
    const { effort_scale } = req.body;
    try {
        const result = await effortScaleSet(effort_scale, user_id);
        if (result) {
            res.status(201).json({ message: "Effort scale successfully updated" })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}


export const setTheme = async (req: Request, res: Response) => {
    const user_id = (req.user as User).id;
    const { theme } = req.body;
    try {
        const result = await themeSet(theme, user_id);
        if (result) {
            res.status(201).json({ message: "Theme successfully updated" })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const setPendingEmail = async (req: Request, res: Response) => {
    const user_id = (req.user as User).id;
    const { pending_email } = req.body;
    try {
        const token = randomUUID();
        const result = await pendingEmailSet(pending_email, token, user_id);
        const resetLink = `http://localhost:3000/confirm-email/${token}`;

        // Configure email transporter (using Gmail as an example)
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        await transporter.sendMail({
            from: '"Rocklyn Apps" <rocklyn.apps@gmail.com>',
            to: pending_email,
            subject: "Confirm Email Address - Lift Log",
            html: `<p>Click <a href="${resetLink}">here</a> to confirm your Lift Log email.</p>`,
        });

        if (result) {
            res.status(201).json({ message: "Confirmation Email sent" })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const confirmEmailChange = async (req: Request, res: Response) => {
    const { pending_email_token } = req.body;
    try {
        const result = await emailChangeConfirm(pending_email_token);
        res.status(201).json({ email: result })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}