import db from "../config/db";

export const timerAdd = async (user_id: number, hours: number, minutes: number, seconds: number, seconds_left: number) => {
    const query = `
    INSERT INTO timers (user_id, hours, minutes, seconds, seconds_left)
    VALUES ($1, $2, $3, $4, $5);`
    try {
        const result = await db.query(query, [
            user_id, hours, minutes, seconds, seconds_left
        ]);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const timerGet = async (user_id: number) => {
    const query = `
    SELECT * from timers where user_id = $1`;
    try {
        const result = await db.query(query, [
            user_id
        ]);
        return result.rows;
    } catch (error) {

        throw error;
    }
}