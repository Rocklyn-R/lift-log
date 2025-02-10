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


export const unitSystemSet = async (unit_system: "metric" | "imperial", user_id: number) => {
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