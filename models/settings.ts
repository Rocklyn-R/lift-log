import e from "express";
import db from "../config/db";

export const settingsCreate = async (user_id: number) => {
    const query = `INSERT INTO settings (user_id) VALUES ($1) RETURNING *`;
    try {
        const result = await db.query(query, [
            user_id
        ]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

export const settingsGet = async (user_id: number) => {
    const query = `SELECT * FROM settings WHERE user_id = $1`;
    try {
        const result = await db.query(query, [user_id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}


export const unitSystemSet = async (unit_system: "Metric" | "Imperial", user_id: number) => {
    const query = `UPDATE settings SET unit_system = $1
    WHERE user_id = $2`;
    try {
        const result = await db.query(query, [unit_system, user_id]);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const effortScaleSet = async (effort_scale: "RPE" | "RIR", user_id: number) => {
    const query = `UPDATE settings SET effort_scale = $1
    WHERE user_id = $2`;
    try {
        const result = await db.query(query, [effort_scale, user_id]);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const themeSet = async (theme: "Light" | "Dark", user_id: number) => {
    const query = `UPDATE settings SET theme = $1
    WHERE user_id = $2`;
    try {
        const result = await db.query(query, [theme, user_id]);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const pendingEmailSet = async (pending_email: string, pending_email_token: string, user_id: number) => {
    const query = `UPDATE settings SET pending_email = $1, pending_email_token = $2
    WHERE user_id = $3`;
    try {
        const result = await db.query(query, [pending_email, pending_email_token, user_id]);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const emailChangeConfirm = async (pending_email_token: string) => {
    const validateTokenQuery = `SELECT user_id, pending_email FROM settings WHERE pending_email_token = $1`;
    const getQuery = `SELECT pending_email, user_id FROM settings WHERE pending_email_token = $1`;
    const changeEmail = `UPDATE users SET email = $1 WHERE id = $2`;
    const removePendingEmailAndToken = `UPDATE settings SET pending_email = NULL
    WHERE user_id = $1`;
    try {
        const validateToken = await db.query(validateTokenQuery, [pending_email_token]);
        if (validateToken.rows.length === 0) {
            return [];
        } else if (validateToken.rows[0].pending_email === null) {
            console.log("THIS")
            console.log(validateToken.rows[0].pending_email)
            return validateToken.rows;
        } else {
            const pendingEmailResult = await db.query(getQuery, [pending_email_token]);
            if (pendingEmailResult) {
                const pending_email = (pendingEmailResult.rows[0].pending_email);
                const user_id = (pendingEmailResult.rows[0].user_id)
                const emailUpdate = await db.query(changeEmail, [pending_email, user_id]);
                const removePendingEmailResult = await db.query(removePendingEmailAndToken, [user_id]);
                return pendingEmailResult.rows;
            }
        }

    } catch (error) {
        console.log(error);
        throw error;
    }
}