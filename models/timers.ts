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


export const timerEdit = async (
    hours: number, 
    minutes: number, 
    seconds: number, 
    seconds_left: number, 
    user_id: number) => {
    const query = `
    UPDATE timers SET hours = $1, minutes = $2, seconds = $3, seconds_left = $4 
    WHERE user_id = $5`;
    try {
        const result = await db.query(query, [
            hours, minutes, seconds, seconds_left, user_id
        ]);
        return result;
    } catch (error) {
        throw error;
    }
}

export const timerPlayPause = async (runningBoolean: boolean, user_id: number) => {
    const query = `
    UPDATE timers SET timer_running = $1
    WHERE user_id = $2`;
    try {
        const result = await db.query(query, [
           runningBoolean, user_id
        ]);
        return result;
    } catch (error) {
        throw error;
    }
}

