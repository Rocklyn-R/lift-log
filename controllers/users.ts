import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import {
    userCreate,
    userFindById,
    userUpdateEmail,
    userUpdatePassword,
    userFindByEmail,
    tokenAdd,
    tokenCheck,
    passwordReset
} from '../models/users';
import nodemailer from 'nodemailer';
import crypto from 'crypto';


interface User {
    id: number
}

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
        res.status(500).json({ message: 'Failed to create user', error: (error as Error).message });
    }
};

export const checkAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(200).json({ message: "User not signed in" });
}


export const editUserEmail = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user_id = (req.user as User).id;
    try {
        const userEmailUpdate = await userUpdateEmail(user_id, email);
        if (userEmailUpdate) {
            res.status(200).json({ message: 'User email successfully updated' });
        } else {
            res.status(404).json({ message: 'User not found or update unsuccessful' });
        }
    } catch (error) {
        console.log('Error creating user:', error);
    }
}

export const changeUserPassword = async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const user_id = (req.user as User).id;
    try {
        const user = await userFindById(user_id);
        const password = user.password;
        const salt = await bcrypt.genSalt(10);
        const matchedPassword = await bcrypt.compare(oldPassword, password);
        if (matchedPassword) {
            const hashedNewPassword = await bcrypt.hash(newPassword, salt);
            const userPasswordChange = await userUpdatePassword(user_id, hashedNewPassword);
            if (userPasswordChange) {
                res.status(200).json({ message: 'Password change successful' });
            } else {
                res.status(404).json({ message: 'Password change failed' });
            }
        } else {
            res.status(404).json({ message: 'Old password incorrect' })
        }
    } catch (error) {
        console.log('Error changing password:', error);
    }
}

export const checkForUserEmail = async (req: Request, res: Response) => {
    const email = req.query.email as string; // Explicitly cast it
    try {
        const result = await userFindByEmail(email!);
        if (result) {
            res.status(200).json({ message: "User found" })
        } else {
            res.status(200).json({ message: "User not found" })
        }
    } catch (error) {
        res.status(404).json({ message: "An error occurred." })
    }
}

function generateResetToken() {
    return crypto.randomBytes(20).toString('hex'); // 20 bytes => 40 characters
}

export const sendResetEmail = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        // Check if the user exists
        const userResult = await userFindByEmail(email);
        console.log(email);
        if (!userResult) {
            console.log("USER NOT FOUND")
            res.status(404).json({ message: "User not found" });
        }

        const userId = userResult.id;
        const token = generateResetToken();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
        const addToken = await tokenAdd(userId, token, expiresAt);
        // Generate a password reset link
        const resetLink = `http://localhost:3000/reset-password/${token}`;

        // Configure email transporter (using Gmail as an example)
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        if (addToken) {
            // Send the email
            await transporter.sendMail({
                from: '"Rocklyn Apps" <rocklyn.apps@gmail.com>',
                to: email,
                subject: "Password Reset Request - Lift Log",
                html: `<p>Click <a href="${resetLink}">here</a> to reset your Lift Log password. This link will expire in 1 hour.</p>`,
            });

            res.json({ message: "Reset email sent successfully" });
        }

    } catch (error) {
        console.log(error);
        console.error("Error sending reset email:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const checkToken = async (req: Request, res: Response) => {
    const token = req.query.token as string; // Explicitly cast it
    try {
            const result = await tokenCheck(token);
            console.log(result);
            if (result) {
                res.status(200).json({ valid: result.valid, message: result.message, user_id: result.user_id })
            }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    const { password, user_id } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const result = await passwordReset(hashedPassword, user_id);
        if (result) {
            res.status(200).json({ message: "Password has been reset" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}